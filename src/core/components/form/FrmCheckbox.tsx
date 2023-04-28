import React from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
import {
    Switch,
    FormHelperText,
    FormControlLabel,
    FormControlLabelProps,
} from '@mui/material';
import { Column } from '../../types/column';
import { toTitleCase } from '../../../utils/stringUtil';
// @mui

// ----------------------------------------------------------------------

interface FrmCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
    column: Column;
    helperText?: React.ReactNode;
}

export default function FrmCheckbox({ column, helperText, ...other }: FrmCheckboxProps) {
    const { control, setValue } = useFormContext();

    return (
        <Controller
            name={column.name}
            control={control}
            defaultValue={false}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <FormControlLabel control={
                        <Switch
                            {...field}
                            checked={field.value ? field.value : false} />}
                        onClick={() => {
                            setValue(column.name, !field.value, { shouldValidate: true });
                            if (column.onChange) {
                                column.onChange();
                            }
                        }
                        }
                        {...other}
                    />

                    {(!!error || helperText) && (
                        <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
                    )}
                </div>
            )}
        />
    );
}