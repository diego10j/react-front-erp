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
            readCustomColumns(req.columns);
            setColumns(req.columns);
            setPrimaryKey(req.primaryKey);
            setIsUpdate(req.rows ? req.rows[0] || false : false)
            setCurrentValues(req.rows ? req.rows[0] || Object.fromEntries(columns.map(e => [e.name, e.defaultValue])) : {})
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const readCustomColumns = (_columns: Column[]) => {
        if (props.customColumns) {
            props.customColumns?.forEach(async (_column) => {
                const currentColumn = _columns.find((_col) => _col.name === _column.name.toLowerCase());
                if (currentColumn) {
                    currentColumn.visible = 'visible' in _column ? _column.visible : currentColumn.visible;
                    currentColumn.label = 'label' in _column ? _column?.label : currentColumn.label;
                    currentColumn.order = 'order' in _column ? _column.order : currentColumn.order;
                    currentColumn.decimals = 'decimals' in _column ? _column.decimals : currentColumn.decimals;
                    currentColumn.comment = 'comment' in _column ? _column.comment : currentColumn.comment;
                    currentColumn.upperCase = 'upperCase' in _column ? _column.upperCase : currentColumn.upperCase;
                }
                else {
                    throw new Error(`Error la columna ${_column.name} no existe`);
                }
            });
            // ordena las columnas
            _columns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1));

        }
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




    const setValue = useCallback(
        (columnName: string, value: any) => {
            console.log(columns)
        },
        [columns]
    );


    return {
        currentValues,
        columns,
        primaryKey,
        isUpdate,
        loading,
        setValue,
        onSave
    }

}