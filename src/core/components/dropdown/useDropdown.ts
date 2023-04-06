import { useState, useEffect } from 'react';
import { ListDataValues } from '../../interface/listDataValues';
import { Query } from '../../interface/query';
import { DropdownProps } from './types';
import { sendPost } from '../../services/serviceRequest';

export type UseDropdownProps = {
    config: ListDataValues | Query;
    selectionMode?: 'single' | 'multiple';
};

export default function UseDropdown(props: UseDropdownProps): DropdownProps {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const selectionMode = props?.selectionMode || 'single';
    const [value, setValue] = useState<string | string[]>(selectionMode === 'multiple' ? [] : '');

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
            if ('tableName' in props.config) {
                const result = await sendPost('/api/core/getListDataValues', props.config);
                const req = result.data;
                setOptions(req);
            }
            else {
                const result = await sendPost(props.config.serviceName, props.config.params);
                const req = result.data;
                setOptions(req);
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    return {
        options,
        value,
        selectionMode,
        loading
    }

}