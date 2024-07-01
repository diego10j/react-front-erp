


import { useMemo } from 'react';

import { useGetListDataValues } from 'src/api/core';

import { Field } from 'src/components/hook-form';

import { useDropdown } from '../dropdown';
import { toTitleCase } from '../../../utils/string-util';

import type { Column } from '../../types';



// ----------------------------------------------------------------------
export type FrmDropdownProps = {
  column: Column;
};
export default function FrmDropdown({ column }: FrmDropdownProps) {

  const emptyRsw = useMemo(() => ({
    dataResponse: [],
    isLoading: false,
    error: undefined,
    isValidating: true
  }), []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const drwOptions = useDropdown({ config: column.dropDown ? useGetListDataValues(column.dropDown) : emptyRsw });

  return (
    <Field.Dropdown size='small' name={column.name} label={toTitleCase(column.label)} useDropdown={drwOptions} InputLabelProps={{ shrink: true }} />
  );


}
