
import { useState, useEffect, useCallback } from 'react';

import { getTimeFormat } from 'src/utils/format-time';
import { isDefined, getObjectFormControl } from 'src/utils/common-util';

import { isUnique, getSeqTable } from 'src/api/core';

import { toast } from 'src/components/snackbar';

import type { Column, ObjectQuery } from '../../types';
import type { UseFormTableProps, UseFormTableReturnProps } from './types';


export default function UseFormTable(props: UseFormTableProps): UseFormTableReturnProps {

  const { dataResponse, isLoading } = props.config;  // error, isValidating

  const generatePrimaryKey: boolean = props.generatePrimaryKey === undefined ? true : props.generatePrimaryKey;

  const [initialize, setInitialize] = useState(false);
  const [primaryKey, setPrimaryKey] = useState("id");
  const [tableName, setTableName] = useState("id");
  const [currentValues, setCurrentValues] = useState<any>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);

  const [colsUpdate, setColsUpdate] = useState<string[]>([]);

  const isPendingChanges = (): boolean => isUpdate === false || colsUpdate.length > 0

  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
        setColumns(dataResponse.columns);
        setPrimaryKey(dataResponse.key);
        setTableName(dataResponse.ref);
      }
      setIsUpdate(dataResponse.rows ? dataResponse.rows[0] || false : false)
      const values = dataResponse.rows ? dataResponse.rows[0] || Object.fromEntries(columns.map(e => [e.name, e.defaultValue])) : {};
      // setCurrentValues(getObjectFormControl(values))
      setCurrentValues(values);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);


  const onRefresh = async () => {
    // await callService();
    console.log('refresh');
  };


  const isValidSave = async (dataForm: any): Promise<boolean> => {
    const colsUnique = columns.filter((col) => col.unique === true);
    // inserta
    if (isUpdate === false) {
      const res = await validateUniqueColumns(dataForm, colsUnique);
      if (res === true) {
        if (generatePrimaryKey === true) {
          const seqTable = await callSequenceTableService();
          // Asigna pk secuencial Tabla
          dataForm[primaryKey.toLowerCase()] = seqTable;
        }
      }
      else {
        return false
      }
    }
    else {
      return validateUniqueColumns(currentValues, colsUnique, currentValues[primaryKey]);
    }
    return true;
  }


  const validateUniqueColumns = useCallback(async (row: any, cols: Column[], id: any = undefined): Promise<boolean> => {
    if (cols.length === 0) return true;
    const uniqueColumns = cols.map(col => ({
      columnName: col.name,
      value: row[col.name]
    }));
    if (uniqueColumns.length === 0) return true;

    const errors: { rowIndex: number, columnId: string }[] = [];

    try {
      const result = await isUnique(tableName, primaryKey, uniqueColumns, id);
      if (result.message !== 'ok') {
        cols.forEach(col => {
          if (!result.rows.includes(col.name)) {
            errors.push({ rowIndex: Number(row[primaryKey]), columnId: col.name });
          }
        });

        toast.error(result.message);
        return false;
      }
      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  }, [primaryKey, tableName]);


  /**
   * Llama al servicio web para obtner el proximo secuencial de la tabla
   * @returns
   */
  const callSequenceTableService = async (): Promise<number> => getSeqTable(tableName, primaryKey, 1);


  const saveForm = (dataForm: any): ObjectQuery[] => {
    const tmpListQuery: ObjectQuery[] = [];
    const isInsert = !isUpdate;

    // Si es una inserción y no se genera una clave primaria, eliminar el campo primario cuando es identity/serial
    if (isInsert && !generatePrimaryKey) {
      delete dataForm[primaryKey];
    }

    // Valores a Insertar o Modificar
    const object: any = {};

    for (let i = 0; i < columns.length; i += 1) {
      const colCurrent = columns[i];
      const columnName = colCurrent.name;
      const value = dataForm[columnName.toLowerCase()] || null;

      // Solo incluir columnas que están en colsUpdate o si es una inserción
      if (colsUpdate.includes(columnName) || isInsert) {
        object[columnName] = value;

        if (isDefined(value)) {
          // Aplica formato dependiendo del componente
          const { component } = getColumn(columnName);
          if (component === 'Time') {
            object[columnName] = getTimeFormat(value);
          }
        }
      }
    }

    if (!isInsert) {
      object[primaryKey] = currentValues[primaryKey]; // pk
    }

    tmpListQuery.push({
      operation: isInsert ? 'insert' : 'update',
      tableName,
      primaryKey,
      object
    });

    return tmpListQuery;
  }


  /**
   * Agrega el nombre de la columna modificada en el onChange del componente
   */
  const updateChangeColumn = (columnId: string, newValue?: any) => {
    // Verificar si el columnId ya existe en colsUpdate
    setColsUpdate(prevColsUpdate =>
      prevColsUpdate.includes(columnId) ? prevColsUpdate : [...prevColsUpdate, columnId]
    );
    if (newValue) {
      // Actualiza el valor de la columna si se envia
      setCurrentValues((prevValues: any) => ({
        ...prevValues,
        [columnId]: newValue,
      }));
    }
  };


  /**
   * Asigan el valor a una columna
   * @param columnName
   * @param value
   */
  const setValue = (columnName: string, value: any) => {
    if (isColumnExist(columnName)) {
      props.ref.current.setValue(columnName, value, { shouldValidate: true })
      setCurrentValues((prevValues: any) => ({
        ...prevValues,
        [columnName]: value,
      }));
    }
  }

  /**
   * Retorna el valor de una columna
   * @param columnName
   * @returns
   */
  const getValue = (columnName: string): any => {
    if (initialize === true) {
      if (isColumnExist(columnName)) return props.ref.current.getValues(columnName);
    }

    return undefined
  }

  /**
   * Valida si existe la columna
   * @param columnName
   * @returns
   */
  const isColumnExist = (columnName: string): boolean => {
    if (columns.find((col) => col.name === columnName)) return true;
    throw new Error(`ERROR. la Columna ${columnName} no existe`);
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




  const getVisibleColumns = (): Column[] => columns.filter((_col: Column) => _col.visible === true)

  return {
    ref: props.ref,
    currentValues,
    columns,
    setColumns,
    getColumn,
    getVisibleColumns,
    initialize,
    primaryKey,
    isUpdate,
    isLoading,
    isPendingChanges,
    updateChangeColumn,
    setValue,
    getValue,
    isValidSave,
    saveForm,
    onRefresh,
    setColsUpdate,
    setCurrentValues,
  }
}

