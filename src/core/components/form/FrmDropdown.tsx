import { useMemo, useCallback } from 'react';

import { Field } from 'src/components/hook-form';

import { useDropdown } from '../dropdown';
import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types';



// ----------------------------------------------------------------------
export type FrmDropdownProps = {
  column: Column;
};
export default function FrmDropdown({ column }: FrmDropdownProps) {

  const label = useMemo(() => toTitleCase(column.label), [column.label]);

  const handleChange = useCallback(() => {
    if (column.onChange) {
      column.onChange();
    }
  },
    [column]
  );

  const emptyRSW = useMemo(() => ({
    dataResponse: [],
    isLoading: false,
    error: undefined,
    isValidating: true,
    mutate: () => Promise.resolve(),
    currentParams: {},
    updateParams: () => Promise.resolve()
  }), []);

  const drwEmpty = useDropdown({ config: emptyRSW });

  return (
    <Field.Dropdown
      size='small'
      name={column.name}
      label={label}
      onChangeColumn={handleChange}
      useDropdown={column.dropDown || drwEmpty}
      InputLabelProps={{ shrink: true }} />
  );


}
