import React, { useState, useEffect } from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { TextField, Autocomplete, FormControlLabelProps } from '@mui/material';

import { Column, Options } from '../../types';
import { toTitleCase } from '../../../utils/stringUtil';
import { sendPost } from '../../services/serviceRequest';



// ----------------------------------------------------------------------

interface FrmDropdownProps extends Omit<FormControlLabelProps, 'control'> {
    column: Column;
    helperText?: React.ReactNode;
}

export default function FrmDropdown({ column, helperText, ...other }: FrmDropdownProps) {

    const { control, setValue } = useFormContext();
    const [listOptions, setListOptions] = useState([]);
    const [loading, setLoading] = useState(false);

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
            const result = await sendPost('/api/core/getListDataValues', column.dropDown);
            const req = result.data;
            setListOptions(req);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    const getOptionLabel = (option: Options) => {
        if (typeof option === 'string') {
            // Busca el valor en el listado
            if (listOptions.length > 0 && option) {
                const search: any = listOptions.find((_element: any) => _element.value === option);
                if (search) return search.label || '';
            }
            return '';
        }
        return option.label || '';
    }



    return (
        <Controller
            name={column.name}
            defaultValue=""
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Autocomplete
                    {...field}
                    size="small"
                    loading={loading}
                    loadingText="Cargando..."
                    options={listOptions}
                    noOptionsText="Sin opciones"
                    fullWidth
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={(option: any, value: string) => option.value === value}
                    onChange={(event, newValue: any) => {
                        setValue(column.name, (newValue === null ? '' : newValue?.value || ''), { shouldValidate: true })
                        if (column.onChange) {
                            column.onChange();
                        }
                    }
                    }
                    renderInput={(params) => (
                        <TextField
                            label={toTitleCase(column.label)}
                            error={!!error}
                            helperText={error ? error?.message : helperText}
                            {...params}
                        />
                    )}
                />
            )}
        />
    );
}
