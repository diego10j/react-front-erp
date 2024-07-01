import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmTextFieldProps = {
  column: Column;
  updateChangeColumn: (columName: string) => void;
};
export default function FrmTextField({ column, updateChangeColumn }: FrmTextFieldProps) {

  const handleChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    updateChangeColumn(column.name);
    if (column.onChange) {
      column.onChange();
    }
  };


  return (
    <Field.Text size='small' type={column.dataType === 'Number' ? 'number' : 'text'} name={column.name} label={toTitleCase(column.label)} onChange={handleChange} />
  );
}

// onChange={(event) => {
//   field.onChange(event.target.value);
//   if (column.onChange) {
//     column.onChange();
//   }
// }
// }
