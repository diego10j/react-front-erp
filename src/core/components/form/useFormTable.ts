import { useState, useEffect } from 'react';
import { getObjectFormControl } from 'src/utils/commonUtil';
import { UseFormTableProps } from './types';
import { sendPost } from '../../services/serviceRequest';
import { Column, ResultQuery } from '../../types';

export default function UseFormTable(props: UseFormTableProps): any {



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
            setIsUpdate(req.rows ? req.rows[0] || false : false)
            setCurrentValues(req.rows ? getObjectFormControl(req.rows[0]) || getObjectFormControl(Object.fromEntries(columns.map(e => [e.name, e.defaultValue]))) : {})
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    return {
        currentValues,
        columns,
        isUpdate,
        loading
    }

}