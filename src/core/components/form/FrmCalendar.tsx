import type { DatePickerProps } from '@mui/lab';

import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmCalendarProps = {
  column: Column;
};

export default function FrmCalendar({ column }: FrmCalendarProps) {


  return (
    <Field.DatePicker slotProps={{ textField: { size: 'small' } }} name={column.name} label={toTitleCase(column.label)} />

  );
}




