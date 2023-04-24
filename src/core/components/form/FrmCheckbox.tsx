import React from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
import {
    Checkbox,
    FormHelperText,
    FormControlLabel,
    FormControlLabelProps,
} from '@mui/material';
import { Column } from '../../types/column';
// @mui

// ----------------------------------------------------------------------

interface FrmCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
    column: Column;
    helperText?: React.ReactNode;
}

export default function FrmCheckbox({ column, helperText, ...other }: FrmCheckboxProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={column.name}
            control={control}
            defaultValue={false}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <FormControlLabel control={<Checkbox {...field} checked={field.value || false} />} {...other} />

                    {(!!error || helperText) && (
                        <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
                    )}
                </div>
            )}
        />
    );
}