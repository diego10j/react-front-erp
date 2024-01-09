import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { getObjectFormControl } from 'src/utils/commonUtil';

import { Column } from '../../types';
import { sendPost } from '../../services/serviceRequest';
import { UseFormTableProps, UseFormTableReturnProps } from './types';

export default function UseFormTable(props: UseFormTableProps): UseFormTableReturnProps {

  const { dataResponse, isLoading } = props.config;  // error, isValidating

  const { enqueueSnackbar } = useSnackbar();
  const [initialize, setInitialize] = useState(false);
  const [primaryKey, setPrimaryKey] = useState("id");
  const [tableName, setTableName] = useState("id");
  const [currentValues, setCurrentValues] = useState<any>({});
  const [columns, setColumns] = useState<Column[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);


  useEffect(() => {
    if (dataResponse.rows) {
      if (initialize === false) {
        setInitialize(true);
        // readCustomColumns(dataResponse.columns);
        setColumns(dataResponse.columns);
        setPrimaryKey(dataResponse.key);
        setTableName(dataResponse.ref);
      }
      setIsUpdate(dataResponse.rows ? dataResponse.rows[0] || false : false)
      const values = dataResponse.rows ? dataResponse.rows[0] || Object.fromEntries(columns.map(e => [e.name, e.defaultValue])) : {};
      setCurrentValues(getObjectFormControl(values))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);


  const onRefresh = async () => {
    // await callService();
    console.log('refresh');
  };


  const onSave = async (data: object) => {
    // Guarda solo si existen cambios en los objetos
    const isChange = JSON.stringify(data) === JSON.stringify(currentValues);
    if (!isChange) {
      try {
        const param = {
          listQuery: [{
            tableName,
            primaryKey,
            object: data,
            operation: isUpdate ? 'update' : 'insert'
          }]
        }
        await sendPost('api/core/save', param);
        setCurrentValues(data)
        enqueueSnackbar(!isUpdate ? 'Creado con exito!' : 'Actualizado con exito!');
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Asigan el valor a una columna
   * @param columnName
   * @param value
   */
  const setValue = (columnName: string, value: any) => {
    if (isColumnExist(columnName)) props.ref.current.setValue(columnName, value, { shouldValidate: true })
  }

  /**
   * Retorna el valor de una columna
   * @param columnName
   * @returns
   */
  const getValue = (columnName: string): any => {
    if (isColumnExist(columnName)) return props.ref.current.getValues(columnName);
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
    currentValues,
    columns,
    setColumns,
    getColumn,
    getVisibleColumns,
    initialize,
    primaryKey,
    isUpdate,
    isLoading,
    setValue,
    getValue,
    onSave,
    onRefresh
  }
}

