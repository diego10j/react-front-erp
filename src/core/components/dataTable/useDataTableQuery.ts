import type { PaginationTable } from 'src/core/types/pagination';
import type { SortingState, PaginationState, ColumnFiltersState } from '@tanstack/react-table';

import { useRef, useState, useEffect, useCallback } from 'react';

import { canDelete } from 'src/api/core';

import { toast } from 'src/components/snackbar';

import type { UseDataTableQueryReturnProps } from './types';
import type { Column, ResponseSWR, CustomColumn } from '../../types';

export type UseDataTableQueryProps = {
  config: ResponseSWR;
  rows?: 25 | 50 | 100| 500
};

export default function useDataTableQuery({ config, rows = 100 }: UseDataTableQueryProps): UseDataTableQueryReturnProps {


  const { dataResponse, isLoading, mutate, currentParams } = config;

  const daTabRef = useRef<any>(null);
  const [primaryKey, setPrimaryKey] = useState<string>("id");
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<any>(); // selectionMode single fila seleccionada o editada
  const [index, setIndex] = useState<number>(-1);
  const [initialize, setInitialize] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);  // Sincroniza con react-table

  const [rowSelection, setRowSelection] = useState({})  // selectionMode multiple /single
  // const getSelectedRows = () => daTabRef.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];

  const [processing, setProcessing] = useState(false);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: rows,
  });
  const [globalFilter, setGlobalFilter] = useState('')

  const getSelectedRows = () => daTabRef.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];

  const [paginationResponse, setPaginationResponse] = useState<PaginationTable | undefined>();
  const [totalRecords, setTotalRecords] = useState<number>(0);


  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
        readCustomColumns(dataResponse.columns);
        setColumns(dataResponse.columns);
        setPrimaryKey(dataResponse.primaryKey);
        setTotalRecords(dataResponse.totalRecords);
      }
      setPaginationResponse(dataResponse.pagination)
      setData(dataResponse.rows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);


  /**
  * Maneja la seleccion de la fila
  */
  useEffect(() => {
    if (index >= 0) {
      try {
        setSelected(data[index]);
        onSelectRow(daTabRef.current.table.getRowModel().rows[index].id)
      } catch (e) {
        setIndex(-1);
        throw new Error(`ERROR. index no válido ${index}`)
      }
    }
    else {
      daTabRef.current.table.setRowSelection({});
      setRowSelection({});
      setSelected(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  /**
   * Actualiza la data
   */
  const onRefresh = async () => {
    setIndex(-1);
    mutate();
  };




  /**
   * Maneja el cambio de ordenamiento usando currentParams del config
   */
  const onSort = useCallback((columnName: string) => {

    // Determinar nueva dirección basada en el estado actual
    const currentSort = sorting.find(s => s.id === columnName);
    const newDirection = currentSort?.desc ? 'ASC' : 'DESC';
    // Actualización optimista (UI inmediata)
    setSorting([{ id: columnName, desc: newDirection === 'DESC' }]);

    // ordena manual
    if (paginationResponse) {

      // Cancelar cualquier petición pendiente
      const abortController = new AbortController();

      //  Preparar parámetros actualizados
      // *** Resetear a la primera página cuando se ordena
      const updatedParams = {
        ...currentParams,
        orderBy: {
          column: columnName,
          direction: newDirection
        }
      };
      // Single Source of Truth: Usar mutate con revalidación controlada
      mutate(updatedParams, {
        revalidate: true,
        optimisticData: (currentData: any) => currentData, // No duplicar actualización
        // Recupera automáticamente si falla
        rollbackOnError: true,
        // No sobrescribir la caché hasta tener respuesta
        populateCache: false,
        fetchOptions: { signal: abortController.signal }
      });
      //  Limpieza
      return () => abortController.abort();
    }
    return undefined;
  }, [paginationResponse, currentParams, mutate, sorting]);


  const onPaginationChange = useCallback(
    (newPagination: PaginationState) => {
      // Actualización optimista (UI)
      setPagination(newPagination);

      // Solo mutar si hay paginación manual
      if (paginationResponse) {
        const abortController = new AbortController();

        const updatedParams = {
          ...currentParams,
          pagination: {
            pageIndex: newPagination.pageIndex,
            pageSize: newPagination.pageSize
          }
        };

        mutate(updatedParams, {
          revalidate: true,
          fetchOptions: { signal: abortController.signal },
        });

        return () => abortController.abort();
      }
      return undefined;
    },
    [paginationResponse, currentParams, mutate]
  );


  const onGlobalFilterChange = useCallback(
    (filterValue: string) => {
      // 1. Actualización optimista (UI inmediata)
      setGlobalFilter(filterValue);
      daTabRef.current.table.setGlobalFilter(filterValue);

      // 2. Si hay paginación manual, actualizar API
      if (totalRecords > pagination.pageSize) {
        const abortController = new AbortController();

        // Resetear a primera página al filtrar (mejor UX)
        const updatedParams = {
          ...currentParams,
          globalFilter: {
            value: filterValue,
            columns: columns.map(({ name }) => name)
          },
          //  page: 1, // Base-1 para API
        };

        mutate(updatedParams, {
          revalidate: true,
          optimisticData: (currentData: any) => currentData, // No duplicar actualización
          rollbackOnError: true,
          populateCache: false,
          fetchOptions: { signal: abortController.signal },
        });

        return () => abortController.abort();
      }
      return undefined;
    },
    [totalRecords, pagination.pageSize, currentParams, columns, mutate]
  );

  const onSelectionModeChange = (_selectionMode: 'single' | 'multiple') => {
    setSelectionMode(_selectionMode)
    setIndex(-1);
    setRowSelection({});
  };

  //  const onUpdate2 = useCallback(async () => {
  //      console.log('2222');
  //      await callService();
  //  eslint-disable-next-line react-hooks/exhaustive-deps
  //  }, []);

  const onSelectRow = useCallback(
    (id: string) => {
      if (selectionMode === 'single') {
        setRowSelection({ [id]: true });
      }
    },
    [selectionMode]
  );

  const readCustomColumns = (_columns: Column[]) => {

    if (!_columns || !Array.isArray(_columns)) {
      console.error("Error: _columns es undefined o no es un array");
      return;
    }


    const { customColumns } = daTabRef.current;
    if (!customColumns) return;
    customColumns.forEach((_column: CustomColumn) => {
      const currentColumn = _columns.find((_col) => _col.name === _column.name.toLowerCase());

      if (!currentColumn) {
        throw new Error(`Error: la columna ${_column.name} no existe`);
      }


      Object.assign(currentColumn, {
        visible: _column.visible ?? currentColumn.visible,
        enableColumnFilter: _column.filter ?? currentColumn.enableColumnFilter,
        enableSorting: _column.orderable ?? currentColumn.enableSorting,
        label: _column.label ?? currentColumn.label,
        header: _column.label ?? currentColumn.label,
        order: _column.order ?? currentColumn.order,
        decimals: _column.decimals ?? currentColumn.decimals,
        comment: _column.comment ?? currentColumn.comment,
        upperCase: _column.upperCase ?? currentColumn.upperCase,
        align: _column.align ?? currentColumn.align,
        size: _column.size ?? currentColumn.size,
        sum: _column.sum ?? currentColumn.sum,
        component: _column.component ?? currentColumn.component,
      });

      // Componentes
      if (_column.component === 'Image' || _column.component === 'Avatar') {
        Object.assign(currentColumn, {
          align: 'center',
          size: 60,
          enableColumnFilter: false,
        });
      } else if (_column.labelComponent) {
        Object.assign(currentColumn, {
          component: 'Label',
          labelComponent: _column.labelComponent,
          enableColumnFilter: false,
        });
      } else if (_column.renderComponent) {
        Object.assign(currentColumn, {
          component: 'Render',
          renderComponent: _column.renderComponent,
        });
      } else if (_column.component === 'Active') {
        Object.assign(currentColumn, {
          size: 100,
        });
      }

    });

    // columnas visibles false
    const hiddenCols = _columns.reduce((acc, _col) => {
      if (!_col.visible) {
        acc[_col.name] = false;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setColumnVisibility(hiddenCols);
    // ordena las columnas
    _columns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1));


  }

  /**
   * Retorna la sumatoria de una columna
   * @param columName
   * @returns
   */
  const getSumColumn = (columName: string) => {
    checkColumnExists(columName);

    // Usamos Array.prototype.reduce para acumular la suma
    const sum: number = data.reduce((prevValue, currRow) => {
      const num = Number(currRow[columName]);
      // Comprobamos si el valor de la columna era un número después de la conversión
      if (!Number.isNaN(num)) {
        return prevValue + num;
      }

      throw new Error(`Error: la columna ${columName} contiene valores que no son números.`);
    }, 0);

    return sum;
  }


  const checkColumnExists = (columName: string) => {
    // Comprobamos si la columna existe
    const currentColumn = columns.find((_col) => _col.name === columName.toLowerCase());

    if (!currentColumn) {
      throw new Error(`Error: la columna ${columName} no existe`);
    }
    return true;
  }

  /**
   * Llama al servicio web para validar si se puede elminar un registro
   * @param values
   * @returns
   */
  const onDeleteRows = async (tableName: string, pk: string) => {
    setProcessing(true);
    const values = getSelectedRows().map((currentRow: any) => Number(currentRow[pk]));
    // Verificar si hay filas seleccionadas antes de proceder
    if (values.length === 0) {
      toast.info('No hay registros seleccionados para eliminar.');
      return;
    }
    try {
      await canDelete(tableName, pk, values, false);
      onSelectionModeChange('single');
      onRefresh();
      const msg = values.length > 1 ? 'Registros eliminados con éxito.' : 'Registro eliminado con éxito.';
      toast.success(msg);
    } catch (error) {
      const msg = values.length > 1 ? 'los registros seleccionados tienen' : 'el registro seleccionado tiene';
      toast.error(`No se puede eliminar, ${msg} relación con estructuras de la base de datos.`);
    }
    finally {
      setProcessing(false);
    }
  }

  return {
    daTabRef,
    data,
    index,
    setIndex,
    initialize,
    rowSelection,
    rows,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    columnFilters,
    columns,
    setColumns,
    primaryKey,
    isLoading,
    processing,
    columnVisibility,
    selected,
    selectionMode,
    sorting,
    paginationResponse,
    totalRecords,
    pagination,
    globalFilter,
    mutate,
    setSorting,
    setPagination,
    setGlobalFilter,
    getSumColumn,
    onRefresh,
    onSelectRow,
    onSelectionModeChange,
    onDeleteRows,
    onSort,
    onPaginationChange,
    onGlobalFilterChange
  }
}
