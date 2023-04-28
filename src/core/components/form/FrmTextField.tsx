import React from 'react';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';
import { Column } from '../../types/column';
import { toTitleCase } from '../../../utils/stringUtil';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  column: Column;
};

export default function FrmTextField({ column, helperText, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={column.name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          onChange={(event) => {
            field.onChange(event.target.value);
            if (column.onChange) {
              column.onChange();
            }
          }
          }
          size="small"
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value || ''}
          error={!!error}
          helperText={error ? error?.message : helperText}
          label={toTitleCase(column.label)}
          {...other}
        />
      )}
    />
  );
}
