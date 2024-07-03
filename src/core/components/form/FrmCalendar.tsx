import { useMemo, useCallback } from 'react';

import { Field } from 'src/components/hook-form';

import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmCalendarProps = {
  column: Column;
  updateChangeColumn: (columName: string) => void;
};

export default function FrmCalendar({ column, updateChangeColumn }: FrmCalendarProps) {

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
    <Field.DatePicker slotProps={{ textField: { size: 'small' } }} name={column.name} label={label} onChangeColumn={handleChange} />

  );
}




