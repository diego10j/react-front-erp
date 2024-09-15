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

  // Función para manejar cambios en el campo de tipo número
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const { value } = event.target;
    // Reemplazar comas por puntos
    const normalizedValue = value.replace(',', '.');
    // Validar si es un número válido (permite decimales)
    if (/^\d*\.?\d*$/.test(normalizedValue)) {
      field.onChange(normalizedValue === '' ? null : parseFloat(normalizedValue));
    }
  };

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
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (type === 'number') {
              handleNumberChange(event, field); // Lógica separada para números
            } else {
              field.onChange(event.target.value); // Lógica para otros tipos de entrada
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
            pattern: type === 'number' ? '[0-9]*' : undefined, // Opcional, útil para móviles
          }}
          {...other}
        />
      )}
    />
  );
}
