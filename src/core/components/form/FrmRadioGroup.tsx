import { useCallback, useMemo } from 'react';

import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types';

// ----------------------------------------------------------------------
export type FrmRadioGroupProps = {
  column: Column;
  updateChangeColumn: (columName: string) => void;
};
export default function FrmRadioGroup({
  column,
  updateChangeColumn
}: FrmRadioGroupProps) {

  const label = useMemo(() => toTitleCase(column.label), [column.label]);

  const handleChange = useCallback(() => {
    updateChangeColumn(column.name);
    if (column.onChange) {
      column.onChange();
    }
  },
    [column, updateChangeColumn]
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
