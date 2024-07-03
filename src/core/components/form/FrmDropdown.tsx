


import { useMemo, useCallback } from 'react';

import { useGetListDataValues } from 'src/api/core';

import { Field } from 'src/components/hook-form';

import { useDropdown } from '../dropdown';
import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types';



// ----------------------------------------------------------------------
export type FrmDropdownProps = {
  column: Column;
  updateChangeColumn: (columName: string) => void;
};
export default function FrmDropdown({ column, updateChangeColumn }: FrmDropdownProps) {

  const label = useMemo(() => toTitleCase(column.label), [column.label]);

  const handleChange = useCallback(() => {
    updateChangeColumn(column.name);
    if (column.onChange) {
      column.onChange();
    }
  },
    [column, updateChangeColumn]
  );

  const emptyRSW = useMemo(() => ({
    dataResponse: [],
    isLoading: false,
    error: undefined,
    isValidating: true
  }), []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const drwOptions = useDropdown({ config: column.dropDown ? useGetListDataValues(column.dropDown) : emptyRSW });

  return (
    <Field.Dropdown
      size='small'
      name={column.name}
      label={label}
      onChangeColumn={handleChange}
      useDropdown={drwOptions}
      InputLabelProps={{ shrink: true }} />
  );


}
