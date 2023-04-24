import React from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DatePickerProps } from '@mui/lab';
import { isValid } from "date-fns";
import { Column } from '../../types/column';
import { toDate } from '../../../utils/formatTime';
import { FORMAT_DATE_FRONT } from '../../../config-global';

// ----------------------------------------------------------------------

type Props = DatePickerProps<any> & {
    column: Column;
};

export default function FrmCalendar({ column, helperText, defaultValue, ...other }: Props) {
    const { control } = useFormContext();



    return (
        <Controller
            name={column.name}
            control={control}
            defaultValue=""
            rules={{
                validate: {
                    valid: (date) => isValid(date) || "Fecha no válida"
                }
            }}
            render={({ field, fieldState: { error } }) => (
                <DatePicker
                    {...field}
                    inputRef={field.ref}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue: Date | null) => field.onChange(newValue)}

                    value={typeof field.value === 'string' ? toDate(field.value, FORMAT_DATE_FRONT) : field.value || ''}
                    renderInput={(params) => (
                        <TextField {...params} size="small" fullWidth onBlur={field.onBlur}
                            name={field.name} error={!!error} helperText={error?.message} />
                    )}

                />
            )}
        />
    );
}




