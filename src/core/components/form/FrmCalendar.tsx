// @mui
import type { DatePickerProps } from '@mui/lab';

import dayjs from 'dayjs';
// form
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

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
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          inputRef={field.ref}
          format="dd/MM/yyyy"
          onChange={(newValue) => field.onChange(newValue)}
          value={dayjs(field.value)}
          slotProps={{ textField: { fullWidth: true, error: !!error, helperText: error?.message } }}
          label={toTitleCase(column.label)}
          {...other}

        />
      )}
    />
  );
}




