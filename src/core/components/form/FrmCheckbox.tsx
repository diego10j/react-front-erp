import { useCallback, useMemo } from 'react';
import { toTitleCase } from 'src/utils/string-util';

import { Field } from 'src/components/hook-form';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmCheckboxProps = {
  column: Column;
  updateChangeColumn: (columName: string) => void;
};

export default function FrmCheckbox({ column, updateChangeColumn }: FrmCheckboxProps) {

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
    <Field.Switch name={column.name} label={label} onChangeColumn={handleChange} />
  );
}


// onClick={() => {
//   setValue(column.name, !field.value, { shouldValidate: true });
//   if (column.onChange) {
//       column.onChange();
//   }
// }
// }
