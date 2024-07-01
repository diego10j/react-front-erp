import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmTextFieldProps = {
  column: Column;
};
export default function FrmTextField({ column }: FrmTextFieldProps) {
  return (
    <Field.Text size='small' type={column.dataType === 'Number' ? 'number' : 'text'} name={column.name} label={toTitleCase(column.label)} />
  );
}

// onChange={(event) => {
//   field.onChange(event.target.value);
//   if (column.onChange) {
//     column.onChange();
//   }
// }
// }
