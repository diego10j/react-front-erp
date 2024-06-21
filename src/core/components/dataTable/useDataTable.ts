import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { save, getSeqTable, getListDataValues, isUnique, isDelete } from 'src/api/core';
import { getTimeFormat } from 'src/utils/format-time';
import { UseDataTableReturnProps } from './types';


import { isEmpty, isDefined } from '../../../utils/common-util';
import { Column, Options, ObjectQuery, ResponseSWR, CustomColumn } from '../../types';



export type UseDataTableProps = {
  config: ResponseSWR;
  ref: any;
  generatePrimaryKey?: boolean;
};

export default function useDataTable(props: UseDataTableProps): UseDataTableReturnProps {

  const [primaryKey, setPrimaryKey] = useState<string>("");
  const [tableName, setTableName] = useState<string>("");
  const [initialize, setInitialize] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  const [errorCells, setErrorCells] = useState<{ rowIndex: number, columnId: string }>();

  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [columnVisibility, setColumnVisibility] = useState({})
  const [selected, setSelected] = useState<any>(); // selectionMode single fila seleccionada o editada
  const [index, setIndex] = useState<number>(-1);

  const [rowSelection, setRowSelection] = useState({})  // selectionMode multiple /single

  const [optionsColumn, setOptionsColumn] = useState(new Map<string, Options[]>());  // DropDownOptions

  const [insertIdList, setInsertIdList] = useState<number[]>([]);
  const [updateIdList, setUpdateIdList] = useState<number[]>([]);
  const [deleteIdList, setDeleteIdList] = useState<number[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const generatePrimaryKey: boolean = props.generatePrimaryKey === undefined ? true : props.generatePrimaryKey;

  const getInsertedRows = () => data.filter((fila) => insertIdList.includes(fila.insert)) || [];


  const getUpdatedRows = () => data.filter((fila) => updateIdList.includes(Number(fila[primaryKey]))) || [];
  const getDeletedRows = () => data.filter((fila) => deleteIdList.includes(Number(fila[primaryKey]))) || [];

  const getSelectedRows = () => props.ref.current.table.getSelectedRowModel().flatRows.map((row: { original: any; }) => row.original) || [];

  const { dataResponse, isLoading, } = props.config;  // error, isValidating

  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
        readCustomColumns(dataResponse.columns);
        setColumns(dataResponse.columns);
        setPrimaryKey(dataResponse.key);
        setTableName(dataResponse.ref)
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
    clearListIdQuery();
    // await callService();
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



  /**
   * Llama al servicio web para obtener la data de los DropDown
   * @param column
   */
  const callServiceDropDown = async (column: CustomColumn) => {
    if (column.dropDown) {
      const req = await getListDataValues(column.dropDown);
      setOptionsColumn(optionsColumn.set(column.name, req));
    }
  }

  /**
   * Llama al servicio web para validar si se puede elminar un registro
   * @param values
   * @returns
   */
  const callIsDeleteService = async (values: any[]): Promise<boolean> => {
    try {
      await isDelete(tableName, primaryKey, values);
      return true;
    } catch (error) {
      const msg = values.length > 1 ? 'los registros seleccionados tienen' : 'el registro seleccionado tiene';
      enqueueSnackbar(`No se puede eliminar, ${msg} relación con estructuras de la base de datos.`, { variant: 'error', });
      return false;
    }
  }

  /**
   * Llama al servicio web para obtner el proximo secuencial de la tabla
   * @returns
   */
  const callSequenceTableService = async (): Promise<number> => {
    const numberRowsAdded = insertIdList.length;
    return getSeqTable(tableName, primaryKey, numberRowsAdded);
  }

  /**
   * Llama al servicio web para guardar los cambios realizados en la tabla
   * @param listQuery
   * @returns
   */
  const callSaveService = async (): Promise<boolean> => {
    const listQuery: ObjectQuery[] = saveDataTable();
    if (listQuery.length > 0) {
      try {
        const param = {
          listQuery
        }
        await save(param);
      } catch (error) {
        enqueueSnackbar(`Error al guardar ${error}`, { variant: 'error', });
        return false;
      }
    }
    // Si elimino filas insertadas las elimina de la data
    if (deleteRow.length > 0)
      deleteRow();
    clearListIdQuery();
    return true;
  }

  /**
   * Lee las configuraciones de las columnas
   * @param _columns
   */
  const readCustomColumns = (_columns: Column[]) => {
    const { customColumns } = props.ref.current;
    if (!customColumns) return;

    customColumns?.forEach((_column: CustomColumn) => {
      const currentColumn = _columns.find((_col) => _col.name.toLowerCase() === _column.name.toLowerCase());

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
        disabled: _column.disabled ?? currentColumn.disabled,
        required: _column.required ?? currentColumn.required,
        unique: _column.unique ?? currentColumn.unique,
        size: _column.size ?? currentColumn.size,
      });

      if ('dropDown' in _column) {
        currentColumn.component = 'Dropdown'
        callServiceDropDown(_column);
        currentColumn.dropDown = _column.dropDown;
        currentColumn.size = 280; // por defecto
        currentColumn.align = 'left';
      }
      if ('radioGroup' in _column) {
        currentColumn.radioGroup = _column.radioGroup;
        currentColumn.component = 'RadioGroup'
      }
      currentColumn.size = 'size' in _column ? _column.size : currentColumn.size;

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
   * Asigna el valor a una columna
   * @param indexRow
   * @param columnName
   * @param value
   */
  const setValue = (indexRow: number, columnName: string, value: any) => {
    if (isColumnExist(columnName)) {
      data[indexRow][columnName.toLowerCase()] = value;
      updateData(index, columnName, value);
    }
  }

  /**
   * Retorna el valor de una columna
   * @param indexRow
   * @param columnName
   * @returns
   */
  const getValue = (indexRow: number, columnName: string): any => {
    if (isColumnExist(columnName)) return data[indexRow][columnName.toLowerCase()];
    return undefined
  }

  /**
   * Actualiza el state de la data
   * @param indexRow
   * @param columnName
   * @param value
   */
  const updateData = (indexRow: number, columnName: string, value: any) => {
    props.ref.current.table.options.meta?.updateData(index, columnName, value);
  }

  const updateDataByRow = (indexRow: number, newRow: any) => {
    props.ref.current.table.options.meta?.updateDataByRow(index, newRow);
  }


  /**
   * Valida si existe la columna
   * @param columnName
   * @returns
   */
  const isColumnExist = (columnName: string): boolean => {
    if (columns.find((col: Column) => col.name === columnName.toLowerCase())) return true;
    throw new Error(`ERROR. la Columna ${columnName} no existe`);
  }


  const insertRow = (): boolean => {
    // if (true) {
    const tmpPK = 0 - (insertIdList.length + 1);
    const newRow: any = {};
    columns.forEach((_col) => {
      const { name, defaultValue } = _col;
      newRow[name] = defaultValue;
      if (name === primaryKey) {
        newRow[name] = tmpPK;
        newRow.insert = tmpPK;
      }
    });
    const newData = [...data, newRow];
    setData(newData);
    // setFilaSeleccionada(filaNueva);
    setIndex(data.length);
    const newInsert: number[] = insertIdList.concat(tmpPK);
    setInsertIdList(newInsert);
    return true;
    //   }
  };


  /**
   * Verifica si es posible eliminar
   * @param indexRow
   * @returns
   */
  const isDeleteRow = async (indexRow?: number): Promise<boolean> => {
    let canDelete = data.length > 0;
    const pkRows: number[] = [];
    const tmpInsert = insertIdList;
    if (indexRow) {
      // Elimina por indice
      const row = data[indexRow]
      if (!isDefined(row.insert))
        pkRows.push(Number(row[primaryKey]));
      else {
        const indexInsert = tmpInsert.indexOf(Number(row.insert));
        if (indexInsert > -1) {
          pkRows.push(Number(row.insert));
          tmpInsert.splice(indexInsert, 1);
        }
      }
    }
    else {
      // Elimina fila/s seleccionadas
      getSelectedRows().forEach(async (currentRow: any) => {
        if (!isDefined(currentRow.insert)) {
          pkRows.push(Number(currentRow[primaryKey]));
        }
        else {
          const indexInsert = tmpInsert.indexOf(Number(currentRow.insert));
          if (indexInsert > -1) {
            pkRows.push(Number(currentRow.insert));
            tmpInsert.splice(indexInsert, 1);
          }
        }
      });
    }
    if (pkRows.filter(_element => _element > 0).length > 0) {
      // fila(s) modificada, valida si se pueden eliminar
      canDelete = await callIsDeleteService(pkRows.filter(_element => _element > 0));
    }
    if (canDelete) {
      setDeleteIdList(pkRows);
      setInsertIdList(tmpInsert);
    }
    else {
      setDeleteIdList([]);
    }
    return canDelete;
  }

  const deleteRow = (indexRow?: number) => {
    const pkRows: number[] = indexRow ? [] : deleteIdList;
    if (indexRow) {
      // Elimina por indice
      const row = data[indexRow];
      pkRows.push(Number(row[primaryKey]));
    }
    if (pkRows.length > 0) {
      setData(
        data.filter((_row) => !pkRows.includes(Number(_row[primaryKey])))
      );
      setIndex(-1);
    }
  }

  const clearListIdQuery = () => {
    setInsertIdList([]);
    setUpdateIdList([]);
    setDeleteIdList([]);
  }

  const isPendingChanges = (): boolean => insertIdList.length > 0 || updateIdList.length > 0 || deleteIdList.length > 0


  // Función para validar columnas obligatorias
  const validateRequiredColumns = (row: any, cols: Column[]): boolean =>
    cols.every(col => {
      const value = row[col.name];
      if (isEmpty(value)) {
        if (!generatePrimaryKey && col.name === primaryKey) {
          return true;
        }
        handleErrorCell(Number(row[primaryKey]), col.name);
        enqueueSnackbar(`Los valores de la columna ${col.label} son obligatorios`, { variant: 'error' });
        return false;
      }
      return true;
    });

  const validateUniqueColumns = async (row: any, cols: Column[], id: any = undefined): Promise<boolean> => {
    const uniqueColumns = cols.map(col => ({
      columnName: col.name,
      value: row[col.name]
    }));
    try {
      const result = await isUnique(tableName, primaryKey, uniqueColumns, id);
      if (result.message !== 'ok') {
        enqueueSnackbar(result.message, { variant: 'error' });
      }
      return true;
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
      return false;
    }
  };


  const handleErrorCell = useCallback((rowIndex: number, columnId: string) => {
    setErrorCells({ rowIndex, columnId });
  }, []);

  const isValidSave = async (): Promise<boolean> => {

    const colsRequired = columns.filter((col) => col.required === true);
    const colsUnique = columns.filter((col) => col.unique === true);
    const insRow = getInsertedRows();
    const updRows = getUpdatedRows();

    // 1 filas nuevas
    const newRowsValidations = await Promise.all(insRow.map(async row => {
      if (!validateRequiredColumns(row, colsRequired)) return false;
      return validateUniqueColumns(row, colsUnique);
    }));
    if (!newRowsValidations.every(result => result)) return false;


    // 2 en filas modificadas

    const updatedRowsValidations = await Promise.all(updRows.map(async row => {
      if (isDefined(row.colsUpdate)) {
        const colsToUpdate = row.colsUpdate.map((colName: string) => getColumn(colName));
        const requiredCols = colsToUpdate.filter((col: Column) => col.required);
        const uniqueCols = colsToUpdate.filter((col: Column) => col.unique);

        if (!validateRequiredColumns(row, requiredCols)) return false;
        return validateUniqueColumns(row, uniqueCols, row[primaryKey]);
      }
      return true;
    }));
    if (!updatedRowsValidations.every(result => result)) return false;


    if (generatePrimaryKey === true && insRow.length > 0) {
      // Calcula valores claves primarias en filas insertadas
      let seqTable = await callSequenceTableService();
      insRow.forEach((currentRow) => {
        // Asigna pk secuencial Tabla
        currentRow[primaryKey.toLowerCase()] = seqTable;
        seqTable += 1;
      });
    }
    return true;
  }

  const saveDataTable = (): ObjectQuery[] => {

    const tmpListQuery: ObjectQuery[] = [];
    const insRows = getInsertedRows();
    for (let i = 0; i < insRows.length; i += 1) {
      const currentRow = insRows[i];

      if (generatePrimaryKey === false) {
        // elimina campo primario cuando es identity/serial
        delete currentRow[primaryKey];
      }

      // Valores a Insertar
      const object: any = {};
      for (let j = 0; j < columns.length; j += 1) {
        const colCurrent = columns[j];
        const columnName = colCurrent.name;
        // filaActual = this.validarFila(colCurrent, filaActual);
        const value = currentRow[columnName] === '' ? null : currentRow[columnName];
        object[columnName] = value;

        if (isDefined(value)) {
          // Aplica formato dependiendo del componente
          const component = getColumn(columnName).component;
          if (component === 'Time') {
            object[columnName] = getTimeFormat(value);
          }
        }

      }
      tmpListQuery.push({
        operation: 'insert',
        tableName,
        primaryKey,
        object
      });
    }
    const updRows = getUpdatedRows();
    for (let i = 0; i < updRows.length; i += 1) {
      const currentRow = updRows[i];
      if (isDefined(currentRow.colsUpdate)) {
        // Columnas modificadas
        const { colsUpdate } = currentRow;
        const object: any = {};
        for (let j = 0; j < colsUpdate.length; j += 1) {
          const columnName = colsUpdate[j];
          const value = currentRow[columnName.toLowerCase()] === '' ? null : currentRow[columnName.toLowerCase()];
          object[columnName] = value;
          if (isDefined(value)) {
            // Aplica formato dependiendo del componente
            const component = getColumn(columnName).component;
            if (component === 'Time') {
              object[columnName] = getTimeFormat(value);
            }
          }
        }
        object[primaryKey] = currentRow[primaryKey]; // pk
        tmpListQuery.push({
          operation: 'update',
          tableName,
          primaryKey,
          object
        });
      }
    }
    const delRows = getDeletedRows();
    for (let i = 0; i < delRows.length; i += 1) {
      const currentRow = delRows[i];
      const value = Number(currentRow[primaryKey] || -1);
      if (value > 0) {
        const object: any = {};
        object[primaryKey] = value;
        tmpListQuery.push({
          operation: 'delete',
          tableName,
          primaryKey,
          object
        });
      }
    }
    // ----
    return tmpListQuery;
  }

  /**
   * Retorna un objeto columna
   * @param columnName
   * @returns
   */
  const getColumn = (columnName: string): Column => {
    const col = columns.find((_col) => _col.name === columnName);
    if (col === undefined) throw new Error(`ERROR. la Columna ${columnName} no existe`)
    return col;
  }

  return {
    data,
    columns,
    setColumns,
    optionsColumn,
    setData,
    setValue,
    getValue,
    index,
    generatePrimaryKey,
    updateData,
    updateDataByRow,
    setIndex,
    deleteRow,
    isDeleteRow,
    insertRow,
    saveDataTable,
    clearListIdQuery,
    isValidSave,
    isPendingChanges,
    initialize,
    primaryKey,
    isLoading,
    selected,
    columnVisibility,
    setColumnVisibility,
    selectionMode,
    rowSelection,
    updateIdList,
    setUpdateIdList,
    setRowSelection,
    errorCells,
    setErrorCells,
    onRefresh,
    onSelectRow,
    onSelectionModeChange,
    getInsertedRows,
    getUpdatedRows,
    callSaveService
  }
}
