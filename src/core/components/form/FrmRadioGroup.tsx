import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types';

// ----------------------------------------------------------------------
export type FrmRadioGroupProps = {
  column: Column;
};
export default function FrmRadioGroup({
  column,
}: FrmRadioGroupProps) {

  return (
      <Field.RadioGroup
      row
      name={column.name}
      label={toTitleCase(column.label)}

      options={column?.radioGroup || []}
      sx={{ gap: 4 }}
    />

      );
}
