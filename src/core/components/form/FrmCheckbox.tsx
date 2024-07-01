import { toTitleCase } from 'src/utils/string-util';

import { Field } from 'src/components/hook-form';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmCheckboxProps = {
  column: Column;
};

export default function FrmCheckbox({ column }: FrmCheckboxProps) {
  return (
    <Field.Switch  name={column.name} label={toTitleCase(column.label)} />
  );
}


// onClick={() => {
//   setValue(column.name, !field.value, { shouldValidate: true });
//   if (column.onChange) {
//       column.onChange();
//   }
// }
// }
