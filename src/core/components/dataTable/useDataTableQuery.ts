import { ColumnFilter } from '@tanstack/react-table';
import { useState, useEffect, useCallback } from 'react';

import { UseDataTableQueryReturnProps } from './types';
import { Column, ResponseSWR, CustomColumn } from '../../types';

export type UseDataTableQueryProps = {
  config: ResponseSWR;
  ref: any;
};

export default function useDataTableQuery(props: UseDataTableQueryProps): UseDataTableQueryReturnProps {

  const [primaryKey, setPrimaryKey] = useState<string>("id");
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [columnVisibility, setColumnVisibility] = useState({})
  const [selected, setSelected] = useState<any>(); // selectionMode single fila seleccionada o editada
  const [index, setIndex] = useState<number>(-1);
  const [initialize, setInitialize] = useState(false);

  const [rowSelection, setRowSelection] = useState({})  // selectionMode multiple /single
  // const getSelectedRows = () => props.ref.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];

  const { dataResponse, isLoading, mutate } = props.config;  // error, isValidating

  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
        readCustomColumns(dataResponse.columns);
        setColumns(dataResponse.columns);
        setPrimaryKey(dataResponse.primaryKey);
      }
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
        onSelectRow(props.ref.current.table.getRowModel().rows[index].id)
      } catch (e) {
        setIndex(-1);
        throw new Error(`ERROR. index no válido ${index}`)
      }
    }
    else {
      props.ref.current.table.setRowSelection({});
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

  const setColumnFilters = (filters: ColumnFilter[]) => {
    props.ref.current.table.setColumnFilters(filters);
  }

  const readCustomColumns = (_columns: Column[]) => {
    const { customColumns } = props.ref.current;
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
      });

      // Componentes
      if (_column.component === 'Image') {
        Object.assign(currentColumn, {
          component: 'Image',
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

  return {
    data,
    index,
    setIndex,
    initialize,
    rowSelection,
    setRowSelection,
    setColumnVisibility,
    setColumnFilters,
    columns,
    primaryKey,
    isLoading,
    columnVisibility,
    selected,
    selectionMode,
    onRefresh,
    onSelectRow,
    onSelectionModeChange
  }
}
