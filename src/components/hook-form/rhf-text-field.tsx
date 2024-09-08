import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
  onChangeColumn?: () => void;
};

export function RHFTextField({ name, helperText, type, onChangeColumn, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={field.value || ''}
          onChange={(event) => {
            const { value } = event.target;
            if (type === 'number') {
              // Reemplaza comas por puntos y convierte a número
              const normalizedValue = value.replace(',', '.');
              // Validar si es un número válido
              if (/^\d*\.?\d*$/.test(normalizedValue)) {
                setValue(name, normalizedValue === '' ? null : parseFloat(normalizedValue), { shouldValidate: true, })
                field.onChange(normalizedValue === '' ? null : parseFloat(normalizedValue));
              }

            } else {
              field.onChange(value);
            }
            if (onChangeColumn) {
              onChangeColumn();
            }
          }}
          error={!!error}
          helperText={error?.message ?? helperText}
          inputProps={{
            autoComplete: 'off',
            inputMode: type === 'number' ? 'decimal' : 'text',
            pattern: type === 'number' ? '[0-9]*' : undefined,
          }}
          {...other}
        />
      )}
    />
  );
}
