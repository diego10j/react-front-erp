import { useMemo, useCallback } from 'react';

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

  const label = useMemo(() => toTitleCase(column.label), [column.label]);

  const handleChange = useCallback(() => {
    if (column.onChange) {
      column.onChange();
    }
  },
    [column]
  );

  return (
    <Field.RadioGroup
      row
      name={column.name}
      label={label}
      onChangeColumn={handleChange}
      options={column?.radioGroup || []}
      sx={{ gap: 4 }}
    />

  );
}
