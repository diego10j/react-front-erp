import { useMemo, useCallback } from 'react';

import { toTitleCase } from 'src/utils/string-util';

import { Field } from 'src/components/hook-form';

import type { Column } from '../../types/column';

// ----------------------------------------------------------------------
export type FrmCheckboxProps = {
  column: Column;
};

export default function FrmCheckbox({ column }: FrmCheckboxProps) {

  const label = useMemo(() => toTitleCase(column.label), [column.label]);

  const handleChange = useCallback(() => {
    if (column.onChange) {
      column.onChange();
    }
  },
    [column]
  );


  return (
    <Field.Checkbox name={column.name} label={label} onChangeColumn={handleChange} />
  );
}


// onClick={() => { RHF
//   setValue(column.name, !field.value, { shouldValidate: true });
//   if (column.onChange) {
//       column.onChange();
//   }
// }
// }
