import { useState, useEffect, useCallback } from 'react';
// import { getObjectFormControl } from 'src/utils/commonUtil';
import { useSnackbar } from 'notistack';
import { UseFormTableProps } from './types';
import { sendPost } from '../../services/serviceRequest';
import { Column, ResultQuery } from '../../types';

export default function UseFormTable(props: UseFormTableProps): any {

    const { enqueueSnackbar } = useSnackbar();
    const [primaryKey, setPrimaryKey] = useState<string>("id");
    const [currentValues, setCurrentValues] = useState<object>({});
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
            const result = await sendPost('api/core/getSingleResultTable', props.config);
            const req: ResultQuery = result.data;
            setColumns(req.columns);
            setPrimaryKey(req.primaryKey);
            setIsUpdate(req.rows ? req.rows[0] || false : false)
            setCurrentValues(req.rows ? req.rows[0] || Object.fromEntries(columns.map(e => [e.name, e.defaultValue])) : {})
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }


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




    const setValue = (columnName: string, value: any) => {
        props.ref.current.setValue(columnName, value, { shouldValidate: true })
    }



    return {
        currentValues,
        columns,
        setColumns,
        primaryKey,
        isUpdate,
        loading,
        setValue,
        onSave
    }
}

