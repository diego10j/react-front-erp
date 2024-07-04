import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  onChangeColumn?: () => void;
};

export function RHFTextField({ name, helperText, type, onChangeColumn, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          // value={type === 'number' && field.value === 0 ? '' : field.value || ''}
          value={field.value || ''}
          onChange={(event) => {
            // if (type === 'number') {
            //   field.onChange(Number(event.target.value));
            // } else {
            //   field.onChange(event.target.value);
            // }
            field.onChange(event.target.value);
            // setValue(name, event.target.value)
            if (onChangeColumn) {
              onChangeColumn();
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
          }}
          {...other}
        />
      )}
    />
  );
}
