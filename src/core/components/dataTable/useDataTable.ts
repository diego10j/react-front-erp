import { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { UseDataTableReturnProps } from './types';
import { sendPost } from '../../services/serviceRequest';
import { ResultQuery, Column, TableQuery, CustomColumn, Options, ObjectQuery } from '../../types';
import { isEmpty, isDefined } from '../../../utils/commonUtil';



export type UseDataTableProps = {
    config: TableQuery;
    ref: any;
};

export default function useDataTable(props: UseDataTableProps): UseDataTableReturnProps {

    const [primaryKey, setPrimaryKey] = useState<string>("");
    const [initialize, setInitialize] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const [listQuery, setListQuery] = useState<ObjectQuery[]>([]);

    const [loading, setLoading] = useState(false);
    const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
    const [columnVisibility, setColumnVisibility] = useState({})
    const [selected, setSelected] = useState<any>(); // selectionMode single fila seleccionada o editada
    const [index, setIndex] = useState<number>(-1);

    const [rowSelection, setRowSelection] = useState({})  // selectionMode multiple /single

    const [optionsColumn, setOptionsColumn] = useState(new Map<string, Options[]>());  // DropDownOptions

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        // Create an scoped async function in the hook
        async function init() {
            await callService();
            props.config.identity = props.config.identity || true;
        } // Execute the created function directly
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


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
        else setSelected(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);


    /**
     * Actualiza la data
     */
    const onRefresh = async () => {
        setIndex(-1);
        await callService();
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

    const callService = async () => {
        setLoading(true);
        try {
            const result = await sendPost('api/core/getResultQuery', props.config);
            const req: ResultQuery = result.data;
            if (initialize === false) {
                setInitialize(true);
                readCustomColumns(req.columns);
                setColumns(req.columns);
                setPrimaryKey(req.primaryKey);
            }
            setData(req.rows);
        } catch (error) {
            throw new Error(`Error callServiceDropDown ${error}`);
        }
        setLoading(false);
    }

    const callServiceDropDown = async (column: CustomColumn) => {
        try {
            const result = await sendPost('/api/core/getListDataValues', column.dropDown);
            const req = result.data;
            setOptionsColumn(optionsColumn.set(column.name, req));
        } catch (error) {
            throw new Error(`Error callServiceDropDown ${error}`);
        }
    }

    const readCustomColumns = (_columns: Column[]) => {
        const { customColumns } = props.ref.current;
        if (customColumns) {
            customColumns?.forEach(async (_column: CustomColumn) => {
                const currentColumn = _columns.find((_col) => _col.name === _column.name.toLowerCase());
                if (currentColumn) {
                    currentColumn.name = currentColumn.name.toLowerCase();
                    currentColumn.visible = 'visible' in _column ? _column.visible : currentColumn.visible;
                    currentColumn.enableColumnFilter = 'filter' in _column ? _column.filter : currentColumn.enableColumnFilter;
                    currentColumn.enableSorting = 'orderable' in _column ? _column.orderable : currentColumn.enableSorting;
                    currentColumn.label = 'label' in _column ? _column?.label : currentColumn.label;
                    currentColumn.header = 'label' in _column ? _column?.label : currentColumn.label;
                    currentColumn.order = 'order' in _column ? _column.order : currentColumn.order;
                    currentColumn.decimals = 'decimals' in _column ? _column.decimals : currentColumn.decimals;
                    currentColumn.comment = 'comment' in _column ? _column.comment : currentColumn.comment;
                    currentColumn.upperCase = 'upperCase' in _column ? _column.upperCase : currentColumn.upperCase;
                    currentColumn.align = 'align' in _column ? _column.align : currentColumn.align;
                    currentColumn.size = 'size' in _column ? _column.size : currentColumn.size;
                    currentColumn.disabled = 'disabled' in _column ? _column.disabled : currentColumn.disabled;
                    currentColumn.required = 'required' in _column ? _column.required : currentColumn.required;
                    currentColumn.unique = 'unique' in _column ? _column.unique : currentColumn.unique;
                    if ('dropDown' in _column) {
                        currentColumn.component = 'Dropdown'
                        callServiceDropDown(_column);
                        currentColumn.size = 280; // por defecto  
                    }
                    if ('radioGroup' in _column) {
                        currentColumn.radioGroup = _column.radioGroup;
                        currentColumn.component = 'RadioGroup'
                    }
                    currentColumn.size = 'size' in _column ? _column.size : currentColumn.size;
                }
                else {
                    throw new Error(`Error la columna ${_column.name} no existe`);
                }
            });
            // columnas visibles false
            const hiddenCols: any = {};
            _columns.filter((_col) => _col.visible === false).forEach(_element => {
                hiddenCols[_element.name] = false
            });
            setColumnVisibility(hiddenCols);
            // ordena las columnas
            _columns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1));
        }
    }


    /**
     * Asigan el valor a una columna 
     * @param columnName 
     * @param value 
     */
    const setValue = (indexRow: number, columnName: string, value: any) => {
        if (isColumnExist(columnName)) {
            data[indexRow][columnName.toLowerCase()] = value;
            props.ref.current.table.options.meta?.updateData(index, columnName, value);
        }
    }

    /**
     * Retorna el valor de una columna
     * @param columnName 
     * @returns 
     */
    const getValue = (indexRow: number, columnName: string): any => {
        if (isColumnExist(columnName)) return data[indexRow][columnName.toLowerCase()];
        return undefined
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

    const getInsertedRows = () => data.filter((fila) => fila.insert === true) || [];

    const getUpdatedRows = () => data.filter((fila) => fila.update === true) || [];

    const insertRow = (): boolean => {
        if (true) {
            const tmpPK = 0 - (getInsertedRows().length + 1);
            const newRow: any = { insert: true };
            columns.forEach((_col) => {
                const { name, defaultValue } = _col;
                newRow[name] = defaultValue;
                if (name === primaryKey) newRow[name] = tmpPK;
            });
            const newData = [...data, newRow];
            setData(newData);
            // setFilaSeleccionada(filaNueva);
            setIndex(data.length);
            return true;
        }
        return false;
    };

    const deleteRow = (indexRow?: number): boolean => {
        console.log(indexRow);
        return true;
    }

    const isValidSave = async (): Promise<boolean> => {

        const colsRequired = columns.filter((col) => col.required === true);
        const colsUnique = columns.filter((col) => col.unique === true);
        // 1  filas nuevas
        for (let i = 0; i < getInsertedRows().length; i += 1) {
            const currentRow = getInsertedRows()[i];
            // Validacion de valores que sean válidos
            // for (let j = 0; j < columns.length; j += 1) {
            //    const colCurrent = columns[j];
            // Validaciones
            //    if (isValidaciones(filaActual, colCurrent) === false) return false;
            // }

            // Valida Columnas Obligatorias
            for (let j = 0; j < colsRequired.length; j += 1) {
                const currentCol = colsRequired[j];
                if (props.config.identity === true && currentCol.name !== props.config.primaryKey) {
                    // No aplica a campoPrimario
                    const value = currentRow[currentCol.name];
                    if (isEmpty(value)) {
                        enqueueSnackbar(`Los valores de la columna ${currentCol.label} son obligatorios`, { variant: 'error', });
                        return false;
                    }
                }
            }

            // Valida Columnas con valores Unicos

            // eslint-disable-next-line consistent-return
            colsUnique.forEach(async (currentCol) => {
                const value = currentRow[currentCol.name];
                if (isDefined(value)) {
                    // Valida mediante el servicio web
                    const param = {
                        tableName: props.config.tableName,
                        columnName: currentCol.name,
                        value
                    }
                    try {
                        await sendPost('api/core/isUnique', param);
                    } catch (e) {
                        enqueueSnackbar(e.message, { variant: 'error', });
                        return false;
                    }
                }
            });
        }


        // 2 en filas modificadas
        for (let i = 0; i < getUpdatedRows().length; i += 1) {
            const currentRow = getUpdatedRows()[i];
            // Valores Obligatorios solo columnas modificadas
            const { colsUpdate } = currentRow;
            for (let j = 0; j < colsUpdate.length; j += 1) {
                const colNameCurrent = colsUpdate[j];
                // solo nombres de columnas modificadas
                const currentCol = getColumn(colNameCurrent);
                // Validaciones
                // if (isValidaciones(currentRow, colCurrent) === false) return false;

                if (currentCol.required) {
                    const value = currentRow[colNameCurrent];
                    if (isEmpty(value)) {
                        enqueueSnackbar(`Los valores de la columna ${currentCol.label} son obligatorios`, { variant: 'error', });
                        return false;
                    }
                }
            }
        }


        return true;
    }

    const save = (): boolean => {
        setListQuery([]);
        const tmpListQuery: ObjectQuery[] = [];

        for (let i = 0; i < getInsertedRows().length; i += 1) {
            const currentRow = getInsertedRows()[i];

            if (!props.config.identity) {
                // elimina campo primario cuando es identity/serial
                delete currentRow[props.config.primaryKey];
            }


            // Valores a Insertar
            const object: any = {};
            for (let j = 0; j < columns.length; j += 1) {
                const colCurrent = columns[j];
                // filaActual = this.validarFila(colCurrent, filaActual);
                const value = currentRow[colCurrent.name] === '' ? null : currentRow[colCurrent.name];
                object[colCurrent.name] = value;
                // Formato fecha para la base de datos
                // if (isDefined(value)) {
                // Aplica formato dependiendo del componente
                //     if (colCurrent.componente === 'Calendario') {
                // object[colCurrent.nombre] = getFormatoFechaBDD(this.utilitario.toDate(filaActual[colCurrent.nombre], this.utilitario.FORMATO_FECHA_FRONT));
                //          object[colCurrent.nombre] = getFormatoFechaBDD(valor);
                //     } else if (colCurrent.componente === 'Check') {
                //         object[colCurrent.nombre] = valor === 'true';
                //     }
                //  }
            }
            tmpListQuery.push({
                operation: 'insert',
                tableName: props.config.tableName,
                primaryKey: props.config.primaryKey,
                object
            });
        }



        for (let i = 0; i < getUpdatedRows().length; i += 1) {
            const currentRow = getUpdatedRows()[i];
            const objModifica = {};


            // Columnas modificadas
            const { colsUpdate } = currentRow;
            const object: any = {};
            for (let j = 0; j < colsUpdate.length; j += 1) {
                const colM = colsUpdate[j];
                const valor = currentRow[colM.toLowerCase()] === '' ? null : currentRow[colM.toLowerCase()];
                object[colM] = valor;
                // if (isDefined(valor)) {
                // Aplica formato dependiendo del componente
                //  if (getColumna(colM.toLowerCase()).componente === 'Calendario') {
                //      valoresModifica[colM] = getFormatoFechaBDD(valor);
                //  } else if (getColumna(colM.toLowerCase()).componente === 'Check') {
                //      valoresModifica[colM] = `${valor}` === 'true';
                //  }
                // }
            }
            object[props.config.primaryKey] = currentRow[props.config.primaryKey]; // pk
            tmpListQuery.push({
                operation: 'update',
                tableName: props.config.tableName,
                primaryKey: props.config.primaryKey,
                object
            });
        }

        // ----
        console.log(tmpListQuery);
        return true;

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
        setIndex,
        deleteRow,
        insertRow,
        save,
        isValidSave,
        initialize,
        primaryKey,
        loading,
        selected,
        columnVisibility,
        setColumnVisibility,
        selectionMode,
        rowSelection,
        setRowSelection,
        onRefresh,
        onSelectRow,
        onSelectionModeChange
    }
}
