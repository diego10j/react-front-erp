// @mui
import type { TextFieldProps } from '@mui/material';

import React from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';

import { TextField } from '@mui/material';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

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
