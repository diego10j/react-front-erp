import { useMemo, useCallback } from 'react';

import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmTextFieldProps = {
  column: Column;
};
export default function FrmTextField({ column }: FrmTextFieldProps) {

  const inputType = useMemo(() => (column.dataType === 'Number' ? 'number' : 'text'), [column.dataType]);
  const label = useMemo(() => toTitleCase(column.label), [column.label]);

  const handleChange = useCallback(() => {
    if (column.onChange) {
      column.onChange();
    }
  },
    [column]
  );

  return (
    <Field.Text
      size='small'
      type={inputType}
      name={column.name}
      label={label}
      onChangeColumn={handleChange}
    />
  );
}
