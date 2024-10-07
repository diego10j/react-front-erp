
import { useRef, useState, useEffect, useCallback } from 'react';

import { uuidv4 } from 'src/utils/uuidv4';
import { isDefined } from 'src/utils/common-util';
import { getTimeFormat } from 'src/utils/format-time';

import { isUnique, getSeqTable } from 'src/api/core';

import { toast } from 'src/components/snackbar';

import type { Column, ObjectQuery } from '../../types';
import type { UseDropdownReturnProps } from '../dropdown';
import type { UseFormTableProps, UseFormTableReturnProps } from './types';


export default function UseFormTable(props: UseFormTableProps): UseFormTableReturnProps {

  const { dataResponse, isLoading, mutate } = props.config;  // error, isValidating

  const formRef = useRef<any>(null);

  const generatePrimaryKey: boolean = props.generatePrimaryKey === undefined ? true : props.generatePrimaryKey;

  const [initialize, setInitialize] = useState(false);
  const [primaryKey, setPrimaryKey] = useState("id");
  const [tableName, setTableName] = useState("id");
  const [currentValues, setCurrentValues] = useState<any>();
  const [columns, setColumns] = useState<Column[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isChangeDetected, setIsChangeDetected] = useState(false);
  const [columnChange, setColumnChange] = useState<string[]>([]);


  useEffect(() => {
    if (dataResponse.columns) {
      if (initialize === false) {
        setInitialize(true);
        setColumns(dataResponse.columns);
        setPrimaryKey(dataResponse.key);
        setTableName(dataResponse.ref);
      }
      setIsUpdate(dataResponse.rowCount > 0)
      const values = dataResponse.rowCount > 0 ? dataResponse.rows[0] : Object.fromEntries(dataResponse.columns.map((e: { name: string; }) => [e.name, '']));
      if (dataResponse.rowCount === 0) {
        dataResponse.columns.forEach((c: { name: string; }) => {
          values[c.name] = getDefaultValue(c.name);
        });
      }
      setCurrentValues(values);
    }
  }, [dataResponse, initialize]);


  const onRefresh = async () => {
    await mutate();
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


  /**
 * Retorna el defaultValue si exite en en customColumns
 */
  const getDefaultValue = (columnName: string): any => {
    const { customColumns } = formRef.current;
    if (!customColumns) {
      return '';
    }

    const currentColumn = customColumns.find(
      (col: { name: string }) => col.name.toLowerCase() === columnName.toLowerCase()
    );

    if (!currentColumn || !('defaultValue' in currentColumn)) {
      return '';
    }

    const { defaultValue } = currentColumn;

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  };

  const saveForm = (dataForm: any): ObjectQuery[] => {

    const tmpListQuery: ObjectQuery[] = [];
    const isInsert = !isUpdate;
    // console.log(dataForm);
    // Si es una inserción y no se genera una clave primaria, eliminar el campo primario cuando es identity/serial
    if (isInsert && !generatePrimaryKey) {
      delete dataForm[primaryKey];
    }

    // Valores a Insertar o Modificar
    const object: any = {};

    for (let i = 0; i < columns.length; i += 1) {
      const colCurrent = columns[i];
      const columnName = colCurrent.name;
      const value = dataForm[columnName];
      // console.log(`${columnName}   ${value}`);
      // Solo incluir columnas que están en colsUpdate o si es una inserción
      if (columnChange.includes(columnName) || isInsert) {
        object[columnName] = value;

        if (isDefined(value)) {
          // Aplica formato dependiendo del componente
          const { component } = getColumn(columnName);
          if (component === 'Time') {
            object[columnName] = getTimeFormat(value);
          }
        }
        if (isInsert === true && columnName === 'uuid') {
          object[columnName] = uuidv4();
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
    // if (isUpdate === true) {
    //   // Verificar si el columnId ya existe en colsUpdate
    //   setColsUpdate(prevColsUpdate =>
    //     prevColsUpdate.includes(columnId) ? prevColsUpdate : [...prevColsUpdate, columnId]
    //   );
    // }
    // if (newValue) {
    //   // Actualiza el valor de la columna si se envia
    //   setCurrentValues((prevValues: any) => ({
    //     ...prevValues,
    //     [columnId]: newValue,
    //   }));
    // }
  };

  const updateDropdown = (columnName: string, dropDown?: UseDropdownReturnProps) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.name === columnName
          ? { ...column, dropDown }
          : column
      )
    );
  };


  /**
   * Asigan el valor a una columna
   * @param columnName
   * @param value
   */
  const setValue = (columnName: string, value: any) => {
    if (isColumnExist(columnName)) {
      formRef.current.setValue(columnName, value, { shouldValidate: true })
      setCurrentValues((prevValues: any) => ({
        ...prevValues,
        [columnName]: value,
      }));
    }
  }

  const isSubmitting = (): boolean => formRef.current ? formRef.current.isSubmitting : false;

  const isValidating = (): boolean => formRef.current ? formRef.current.isValidating : false;

  const isSubmitted = (): boolean => formRef.current ? formRef.current.isSubmitted : false;

  const isSubmitSuccessful = (): boolean => formRef.current ? formRef.current.isSubmitSuccessful : false;

  // const isChangeDetected = (): boolean => formRef.current ? formRef.current.isChangeDetected : false;

  const renderOptionsForm = () => formRef.current?.renderOptionsForm;
  /**
   * Retorna el valor de una columna
   * @param columnName
   * @returns
   */
  const getValue = (columnName: string): any => {
    if (initialize === true) {
      if (isColumnExist(columnName)) return formRef.current.getValues(columnName);
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
    formRef,
    currentValues,
    columns,
    mutate,
    setColumns,
    getColumn,
    getVisibleColumns,
    initialize,
    primaryKey,
    isUpdate,
    setIsUpdate,
    isLoading,
    isChangeDetected,
    setIsChangeDetected,
    columnChange,
    setColumnChange,
    updateChangeColumn,
    updateDropdown,
    setValue,
    isSubmitting,
    isValidating,
    isSubmitted,
    isSubmitSuccessful,
    getValue,
    isValidSave,
    renderOptionsForm,
    saveForm,
    onRefresh,
    // setColsUpdate,
    setCurrentValues,
  }
}

