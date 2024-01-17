import React from 'react';
import { isValid } from "date-fns";
// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { DatePickerProps } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';

import { Column } from '../../types/column';
import { toDate } from '../../../utils/format-time';
import { toTitleCase } from '../../../utils/string-util';
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
                    format="dd/MM/yyyy"
                    onChange={(newValue: Date | null) => field.onChange(newValue)}
                    value={typeof field.value === 'string' ? toDate(field.value, FORMAT_DATE_FRONT) : field.value || ''}
                    slotProps={{ textField: { fullWidth: true, error: !!error, helperText: error?.message } }}
                    label={toTitleCase(column.label)}
                    {...other}

                />
            )}
        />
    );
}




