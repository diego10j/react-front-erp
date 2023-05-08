import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { getObjectFormControl } from 'src/utils/commonUtil';
import { UseFormTableProps, UseFormTableReturnProps } from './types';
import { sendPost } from '../../services/serviceRequest';
import { Column, ResultQuery } from '../../types';

export default function UseFormTable(props: UseFormTableProps): UseFormTableReturnProps {

    const { enqueueSnackbar } = useSnackbar();
    const [initialize, setInitialize] = useState(false);
    const [primaryKey, setPrimaryKey] = useState("id");
    const [currentValues, setCurrentValues] = useState<any>({});
    const [columns, setColumns] = useState<Column[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        // Create an scoped async function in the hook
        async function init() {
            await callService();
        } // Execute the created function directly
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const callService = async () => {
        setLoading(true);
        try {
            const result = await sendPost('api/core/getResultQuery', props.config);
            const req: ResultQuery = result.data;
            if (initialize === false) {
                setInitialize(true);
                setColumns(req.columns);
                setPrimaryKey(req.primaryKey);
            }
            setIsUpdate(req.rows ? req.rows[0] || false : false)
            const values = req.rows ? req.rows[0] || Object.fromEntries(columns.map(e => [e.name, e.defaultValue])) : {};
            setCurrentValues(getObjectFormControl(values))
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }


    const onRefresh = async () => {
        await callService();
    };


    const onSave = async (data: object) => {
        // Guarda solo si existen cambios en los objetos
        const isChange = JSON.stringify(data) === JSON.stringify(currentValues);
        if (!isChange) {
            try {
                const param = {
                    tableName: props.config.tableName,
                    primaryKey: props.config.primaryKey,
                    object: data
                }
                await sendPost('api/core/saveOrUpdateObject', param);
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
        loading,
        setValue,
        getValue,
        onSave,
        onRefresh
    }
}

