import type { ZodObject, ZodRawShape } from 'zod';
import type { SortingState } from '@tanstack/react-table';

import { z as zod } from 'zod';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { uuidv4 } from 'src/utils/uuidv4';
import { getTimeFormat } from 'src/utils/format-time';

import { save, isUnique, canDelete, getSeqTable } from 'src/api/core';

import { toast } from 'src/components/snackbar';
import { schemaHelper } from 'src/components/hook-form';

import { isDefined } from '../../../utils/common-util';

import type { UseDataTableReturnProps } from './types';
import type { Column, Options, ObjectQuery, ResponseSWR, CustomColumn } from '../../types';

export type UseDataTableProps = {
  config: ResponseSWR;
  generatePrimaryKey?: boolean;
};

export default function useDataTable(props: UseDataTableProps): UseDataTableReturnProps {

  const daTabRef = useRef<any>(null);

  const [primaryKey, setPrimaryKey] = useState<string>("");
  const [tableName, setTableName] = useState<string>("");
  const [initialize, setInitialize] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  const [errorCells, setErrorCells] = useState<{ rowIndex: number, columnId: string }[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [columnVisibility, setColumnVisibility] = useState({})
  const [index, setIndex] = useState<number>(-1);

  const [rowSelection, setRowSelection] = useState({})  // selectionMode multiple /single

  const [optionsColumn, setOptionsColumn] = useState(new Map<string, Options[]>());  // DropDownOptions

  const [insertIdList, setInsertIdList] = useState<number[]>([]);
  const [updateIdList, setUpdateIdList] = useState<number[]>([]);
  const [deleteIdList, setDeleteIdList] = useState<number[]>([]);


  const generatePrimaryKey = useMemo(() => props.generatePrimaryKey ?? true, [props.generatePrimaryKey]);

  const getInsertedRows = useCallback(() => data.filter((fila) => insertIdList.includes(fila.insert)) || [], [data, insertIdList]);

  const getUpdatedRows = useCallback(() => data.filter((fila) => updateIdList.includes(Number(fila[primaryKey]))) || [], [data, updateIdList, primaryKey]);

  const getDeletedRows = useCallback(() => data.filter((fila) => deleteIdList.includes(Number(fila[primaryKey]))) || [], [data, deleteIdList, primaryKey]);

  const getSelectedRows = useCallback(() => daTabRef.current.table.getSelectedRowModel().flatRows.map((row: { original: any }) => row.original) || [], [daTabRef]);

  const { dataResponse, isLoading, mutate, currentParams } = props.config;  // error, isValidating

  const [dynamicSchema, setDynamicSchema] = useState<ZodObject<ZodRawShape>>(zod.object({}));

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
        // verifica pagina mostrada
        const { pageSize } = daTabRef.current.table.getState().pagination;
        const pageIndex = Math.floor(index / pageSize);
        // Ensure the table is on the correct page
        daTabRef.current.table.setPageIndex(pageIndex);
        onSelectRow(daTabRef.current.table.getRowModel().rows[index % pageSize].id)
      } catch (e) {
        setIndex(-1);
        throw new Error(`ERROR. index no válido ${index}`)
      }
    }
    else {
      daTabRef.current.table.setPageIndex(0);
      daTabRef.current.table.setRowSelection({});
      setRowSelection({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);


  /**
   * Actualiza la data
   */
  const onRefresh = useCallback(async () => {
    setIndex(-1);
    setErrorCells([]);
    clearListIdQuery();
    const newData = await mutate();
    if (newData && newData.rows) {
      setData(newData.rows);
    }
  }, [mutate]); // Dependencia de mutate

  const onReset = useCallback(async () => {
    // estado inicial
    setData([]);
    setIndex(-1);
    setErrorCells([]);
    clearListIdQuery();
    daTabRef.current.setEditingCell(undefined);
    daTabRef.current.setColumnFilters([]);
    daTabRef.current.setGlobalFilter('');
  }, [daTabRef]); // Dependencia de daTabRef


  const onSelectionModeChange = useCallback((_selectionMode: 'single' | 'multiple') => {
    setSelectionMode(_selectionMode);
    setIndex(-1);
    setRowSelection({});
  }, []);

  const onSelectRow = useCallback(
    (id: string) => {
      if (selectionMode === 'single') {
        setRowSelection({ [id]: true });
      }
    },
    [selectionMode]
  );

  /**
   * Llama al servicio web para validar si se puede elminar un registro
   * @param values
   * @returns
   */
  const callCanDeleteService = async (values: any[]): Promise<boolean> => {
    try {
      await canDelete(tableName, primaryKey, values);
      return true;
    } catch (error) {
      const msg = values.length > 1 ? 'los registros seleccionados tienen' : 'el registro seleccionado tiene';
      toast.error(`No se puede eliminar, ${msg} relación con estructuras de la base de datos.`);
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
        toast.error(`Error al guardar ${error}`);
        return false;
      }
    }
    // Si elimino filas insertadas las elimina de la data
    if (deleteRow.length > 0)
      deleteRow();
    daTabRef.current.table.setRowSelection({});
    setRowSelection({});
    commitChanges();
    return true;
  }


  const generateSchema = useCallback((_columns: Column[]) => {
    // Esquema
    // eslint-disable-next-line prefer-destructuring
    const schema: ZodObject<ZodRawShape> = daTabRef.current.schema;

    const schemaObject: { [key: string]: any } = {};
    _columns.forEach(column => {
      if (column.visible === true) {
        let fieldSchema: any;
        if (column.name === primaryKey) {
          fieldSchema = zod.any();
        } else {
          switch (column.dataType) {
            case 'Number':
              fieldSchema = zod.union([
                zod.number(),
                zod.string().transform(value => value === '' ? null : parseFloat(value))
              ]).refine(value => value === null || typeof value === 'number', {
                message: `${column.label} debe ser un número o estar vacío`
              });

              // Solo aplicar min si es obligatorio y el tipo es number
              if (column.required) {
                fieldSchema = fieldSchema.refine((value: null) => value !== null, { message: `${column.label} es obligatorio!` });
                if (typeof fieldSchema === 'function') {
                  fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
                }
              }
              break;

            case 'String':
              fieldSchema = zod.string();
              if (column.required) {
                fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
              }
              if (column.length) {
                fieldSchema = fieldSchema.max(column.length, { message: `${column.label} debe tener máximo ${column.length} caracteres!` });
              }
              fieldSchema = fieldSchema.transform((value: string) => value === '' ? null : value);
              break;

            case 'Boolean':
              fieldSchema = zod.boolean();
              // No aplicar min en booleans, pero puedes verificar si es requerido
              if (column.required) {
                fieldSchema = fieldSchema.refine((value: null) => value !== null, { message: `${column.label} es obligatorio!` });
              }
              break;

            case 'Date':
              fieldSchema = schemaHelper.date({ message: { required_error: `${column.label} es obligatorio!` } });
              break;

            default:
              fieldSchema = zod.any();
          }
        }

        // Aplicar `.nullable()` si es necesario
        fieldSchema = fieldSchema.nullable();
        schemaObject[column.name] = fieldSchema;
      }
    });

    // console.log(schemaObject);
    const generatedSchema = zod.object(schemaObject);
    setDynamicSchema(schema ? generatedSchema.merge(schema) : generatedSchema);
  }, [primaryKey]);


  /**
   * Lee las configuraciones de las columnas
   * @param _columns
   */
  const readCustomColumns = useCallback((_columns: Column[]) => {
    const { customColumns } = daTabRef.current;
    if (!customColumns) return;

    customColumns.forEach((_column: CustomColumn) => {
      const currentColumn = _columns.find((_col) => _col.name.toLowerCase() === _column.name.toLowerCase());

      if (!currentColumn) {
        throw new Error(`Error: la columna ${_column.name} no existe`);
      }
      // Actualizar propiedades del currentColumn
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
        component: _column.component ?? currentColumn.component,
      });


      // Configuración de componentes
      if ('dropDown' in _column) {
        currentColumn.component = 'Dropdown';
        currentColumn.dropDown = _column.dropDown;
        currentColumn.size = 280; // por defecto
        currentColumn.align = 'left';
      }

      if ('radioGroup' in _column) {
        currentColumn.radioGroup = _column.radioGroup;
        currentColumn.component = 'RadioGroup';
      }

      // Componentes
      if (_column.component === 'Color') {
        Object.assign(currentColumn, {
          align: 'center',
          size: 60,
          enableColumnFilter: false,
        });
      }
      else if (_column.component === 'Icon') {
        Object.assign(currentColumn, {
          size: 200,
          enableColumnFilter: false,
        });
      }

      // Asignar tamaño
      currentColumn.size = 'size' in _column ? _column.size : currentColumn.size;
    });

    // Establecer columnas visibles
    setVisibleColumns(_columns);

    // Ordenar las columnas
    _columns.sort((a, b) => Number(a.order) - Number(b.order));
    // Genera esquema
    generateSchema(_columns);


  }, [generateSchema]);




  /**
   * Retorna el defaultValue si exite en en customColumns
   */
  const getDefaultValue = (columnName: string): any => {
    const { customColumns } = daTabRef.current;
    if (!customColumns) {
      return null;
    }

    const currentColumn = customColumns.find(
      (col: { name: string }) => col.name.toLowerCase() === columnName.toLowerCase()
    );

    if (!currentColumn || !('defaultValue' in currentColumn)) {
      return null;
    }

    const { defaultValue } = currentColumn;

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  };


  const setVisibleColumns = (_columns: Column[]) => {
    // columnas visibles false
    const hiddenCols = _columns.reduce((acc, _col) => {
      if (!_col.visible) {
        acc[_col.name] = false;
      }
      return acc;
    }, {} as Record<string, boolean>);
    setColumnVisibility(hiddenCols);
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
  const updateData = useCallback((indexRow: number, columnName: string, value: any) => {
    daTabRef.current.table.options.meta?.updateData(indexRow, columnName, value);
  }, [daTabRef]); // Dependencia de daTabRef

  const updateDataByRow = useCallback((indexRow: number, newRow: any) => {
    daTabRef.current.table.options.meta?.updateDataByRow(indexRow, newRow);
  }, [daTabRef]); // Dependencia de daTabRef


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
    const tmpPK = -1 * (insertIdList.length + 1);
    const newRow: Record<string, any> = {};
    columns.forEach(({ name }) => {
      newRow[name] = getDefaultValue(name);
      if (name === primaryKey) {
        newRow[name] = tmpPK;
        newRow.insert = tmpPK;
      }
      if (name === 'uuid') {
        newRow[name] = uuidv4();
      }
    });
    const newData = [...data, newRow];
    setData(newData);
    setIndex(data.length);
    const newInsert = [...insertIdList, tmpPK];
    setInsertIdList(newInsert);

    return true;
    //   }
  };


  /**
   * Verifica si es posible eliminar
   * @param indexRow
   * @returns
   */
  const canDeleteRow = async (indexRow?: number): Promise<boolean> => {
    let isDelete = data.length > 0;
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
      isDelete = await callCanDeleteService(pkRows.filter(_element => _element > 0));
    }
    if (isDelete) {
      setDeleteIdList(pkRows);
      setInsertIdList(tmpInsert);
    }
    else {
      setDeleteIdList([]);
    }
    return isDelete;
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

  const isChangeDetected = useCallback((): boolean => insertIdList.length > 0 || updateIdList.length > 0 || deleteIdList.length > 0, [insertIdList, updateIdList, deleteIdList]); // Dependencias relevantes

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

        setErrorCells(prevErrorCells => {
          const newErrors = errors.filter(error => !prevErrorCells.some(cell =>
            cell.rowIndex === error.rowIndex && cell.columnId === error.columnId
          ));
          return [...prevErrorCells, ...newErrors];
        });

        toast.error(result.message);
        return false;
      }

      return true;
    } catch (e) {
      toast.error(e.message);
      return false;
    }
  }, [primaryKey, tableName, setErrorCells]);



  const validateSchema = useCallback(
    (row: any, cols: Column[]): boolean => {

      let isValid = true;
      if (dynamicSchema) {
        const errors: { rowIndex: number; columnId: string; message: string }[] = [];
        cols.forEach((col) => {
          const value = row[col.name];
          const columnSchema = dynamicSchema.shape[col.name]; // Obtén el esquema de zod para la columna
          if (columnSchema && col.name in row) {
            try {
              columnSchema.parse(value); // Valida el valor con el esquema de zod si existe
            } catch (error) {
              if (!generatePrimaryKey && col.name === primaryKey) {
                return;
              }
              if (error instanceof zod.ZodError) {
                // Si el schema no valida, registramos el error
                errors.push({
                  rowIndex: Number(row[primaryKey]),
                  columnId: col.name,
                  message: error.errors[0]?.message || 'Error de validación',
                });
                toast.error(`Error en columna ${col.label}: ${error.errors[0]?.message}`);
                isValid = false;
              }
            }
          }
        });
        // console.log(errors);
        if (errors.length > 0) {
          setErrorCells((prevErrorCells) => {
            // Filtrar errores duplicados
            const newErrors = errors.filter(
              (error) =>
                !prevErrorCells.some(
                  (cell) => cell.rowIndex === error.rowIndex && cell.columnId === error.columnId
                )
            );
            return [...prevErrorCells, ...newErrors];
          });
        }
      }


      return isValid;
    },
    [dynamicSchema, generatePrimaryKey, primaryKey]
  );


  /**
   * Maneja el cambio de ordenamiento usando currentParams del config
   */
  const onSort = useCallback((columnName: string) => {
    // 1. Obtener el estado actual desde sorting (fuente de verdad para la UI)
    const currentSort = sorting.find(s => s.id === columnName);
    const isCurrentlySorted = currentSort !== undefined;
    const currentDirection = currentSort?.desc ? 'DESC' : 'ASC';

    // 2. Calcular nueva dirección
    const newDirection = isCurrentlySorted
      ? currentDirection === 'ASC' ? 'DESC' : 'ASC'
      : 'ASC'; // Primer clic ordena ascendente

    // 3. Preparar nuevos parámetros para la API
    const updatedParams = {
      ...currentParams,
      orderBy: {
        column: columnName,
        direction: newDirection
      }
    };

    // 4. Actualizar API y estado local
    mutate(updatedParams);

    // 5. Actualizar estado de react-table
    setSorting([{
      id: columnName,
      desc: newDirection === 'DESC'
    }]);
  }, [currentParams,mutate, sorting]);

  const addErrorCells = useCallback((rowIndex: number, columnId: string) => {
    setErrorCells(prevErrorCells => {
      // Verificar si el error ya existe en el array
      const exists = prevErrorCells.some(cell => cell.rowIndex === rowIndex && cell.columnId === columnId);
      if (exists) {
        return prevErrorCells; // No agregar duplicados
      }
      return [...prevErrorCells, { rowIndex, columnId }]; // Agregar nuevo error
    });
  }, []);

  const removeErrorCells = useCallback((rowIndex: number, columnId: string) => {
    const row = data[rowIndex];
    setErrorCells(prevErrorCells => prevErrorCells.filter(cell => !(cell.rowIndex === Number(row[primaryKey]) && cell.columnId === columnId)));
  }, [data, primaryKey]);

  const isValidSave = async (): Promise<boolean> => {
    const colsRequired = columns.filter((col) => col.required === true);
    const colsUnique = columns.filter((col) => col.unique === true);
    const insRow = getInsertedRows();
    const updRows = getUpdatedRows();

    // Función común para validar filas nuevas y actualizadas
    const validateRows = async (rows: any[], isUpdate: boolean): Promise<boolean> => Promise.all(rows.map(async (row) => {
      // Llamada a validateSchema
      const reducedRow = isUpdate
        ? {
          ...Object.fromEntries(
            row.colsUpdate
              .filter((key: string) => key in row)
              .map((key: string) => [key, row[key]])
          ),
          [primaryKey]: row[primaryKey], // Agrega el primaryKey al objeto
        }
        : row;
      const rowsChanged = reducedRow;

      // validacion columnas unicas
      const uniqueCols = isUpdate
        ? row.colsUpdate.map((colName: string) => getColumn(colName)).filter((col: Column) => col.unique)
        : colsUnique;
      if (!validateSchema(rowsChanged, columns)) return false;

      // Validación de columnas únicas
      return validateUniqueColumns(row, uniqueCols, isUpdate ? row[primaryKey] : undefined);
    })).then(results => results.every(result => result));

    // 1. Validar filas nuevas
    const areNewRowsValid = await validateRows(insRow, false);
    if (!areNewRowsValid) return false;

    // 2. Validar filas modificadas
    const areUpdatedRowsValid = await validateRows(updRows, true);
    if (!areUpdatedRowsValid) return false;

    // 3. Generar claves primarias si es necesario
    if (generatePrimaryKey === true && insRow.length > 0) {
      let seqTable = await callSequenceTableService();
      insRow.forEach((currentRow) => {
        currentRow[primaryKey.toLowerCase()] = seqTable;
        seqTable += 1;
      });
    }
    return true;
  };


  const saveDataTable = (): ObjectQuery[] => {

    const tmpListQuery: ObjectQuery[] = [];
    const [module, table] = tableName.split('_');
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
          const { component } = getColumn(columnName);
          if (component === 'Time') {
            object[columnName] = getTimeFormat(value);
          }
        }

      }

      tmpListQuery.push({
        operation: 'insert',
        module,
        tableName: table,
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
            const { component } = getColumn(columnName);
            if (component === 'Time') {
              object[columnName] = getTimeFormat(value);
            }
          }
        }
        object[primaryKey] = currentRow[primaryKey]; // pk
        tmpListQuery.push({
          operation: 'update',
          module,
          tableName: table,
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
          module,
          tableName: table,
          primaryKey,
          object
        });
      }
    }
    // ----
    return tmpListQuery;
  }

  /**
   * Actualiza la data a filas insertadas y modificadas
   */
  const commitChanges = async () => {
    getInsertedRows().forEach((currentRow: any) => {
      const idx = data.indexOf(currentRow);
      delete currentRow.insert;
      updateDataByRow(idx, currentRow);
      // aqui mutate data nuevas filas
       mutate((prevData: any) => {
         const newData = [...prevData.rows, currentRow];
         return {
           ...prevData,
           rowCount: newData.length,
           rows: newData
         };
       }, false);

    });
    getUpdatedRows().forEach(async (currentRow: any) => {
      const idx = data.indexOf(currentRow);
      delete currentRow.colsUpdate;
      updateDataByRow(idx, currentRow);
      // aqui mutate data  filas modificadas
       mutate((prevData: any) => {
         const newData = prevData.rows;
         newData[idx] = currentRow;
         return {
           ...prevData,
           rows: newData
         };
       }, false);
    });


    // aqui mutate data  filas eliminadas
     mutate((prevData: any) => {
       const oldData = prevData.rows;
       const newData = oldData.filter((fila: any) => !deleteIdList.includes(Number(fila[primaryKey]))) || [];
       return {
         ...prevData,
         rowCount: newData.length,
         rows: newData
       };
     }, false);


    clearListIdQuery();
  }

  /**
   * Retorna un objeto columna
   * @param columnName
   * @returns
   */
  const getColumn = (columnName: string): Column => {
    columnName = columnName.toLowerCase();
    const col = columns.find((_col) => _col.name === columnName);
    if (col === undefined) throw new Error(`ERROR. la Columna ${columnName} no existe`)
    return col;
  }

  return {
    daTabRef,
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
    canDeleteRow,
    insertRow,
    saveDataTable,
    clearListIdQuery,
    commitChanges,
    isValidSave,
    isChangeDetected,
    initialize,
    primaryKey,
    isLoading,
    columnVisibility,
    setColumnVisibility,
    selectionMode,
    rowSelection,
    updateIdList,
    setUpdateIdList,
    setRowSelection,
    errorCells,
    sorting,
    setErrorCells,
    removeErrorCells,
    addErrorCells,
    onRefresh,
    onReset,
    onSelectRow,
    onSelectionModeChange,
    getInsertedRows,
    getUpdatedRows,
    callSaveService
    , onSort
  }
}
