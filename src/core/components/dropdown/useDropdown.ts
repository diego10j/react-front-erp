import { useState, useEffect } from 'react';

import { Options } from '../../types';
import { sendPost } from '../../services/serviceRequest';
import { UseDropdownProps, UseDropdownReturnProps } from './types';

export default function UseDropdown(props: UseDropdownProps): UseDropdownReturnProps {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const selectionMode = props?.selectionMode || 'single';
    const [value, setValue] = useState<string | null>(null);

    useEffect(() => {
        // Create an scoped async function in the hook
        async function init() {
            await callService();
        } // Execute the created function directly
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getOptionLabel = (option: Options): string => {
        if (typeof option === 'string') {
            // Busca el valor en el listado
            if (options.length > 0 && option) {
                const search: any = options.find((_element: any) => _element.value === option);
                if (search) return search.label || '';
            }
            return '';
        }
        return option.label || '';
    }


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
        setValue,
        selectionMode,
        getOptionLabel,
        loading
    }

}
