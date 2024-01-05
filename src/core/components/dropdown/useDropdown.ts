import { useState, useEffect } from 'react';

import { Options } from '../../types';
import { UseDropdownProps, UseDropdownReturnProps } from './types';

export default function UseDropdown(props: UseDropdownProps): UseDropdownReturnProps {
  const [options, setOptions] = useState<any[]>([]);
  const selectionMode = props?.selectionMode || 'single';
  const [value, setValue] = useState<string | null>(null);

  const { dataResponse, isLoading } = props.config;  // error, isValidating

  useEffect(() => {
    if (dataResponse) {
      setOptions(dataResponse);
    }
  }, [dataResponse]);

  /**
   * Retorna el label de un Option
   * @param option
   * @returns
   */
  const getOptionLabel = (option: Options): string => {
    if (typeof option === 'string') {
      // Busca el valor en el listado
      if (options.length > 0 && option) {
        const search: any = options.find((_element: any) => _element.value === option);
        if (search) return search.label || '';
      }
      return '';
    }
    return option.label || '';
  }

  return {
    options,
    value,
    setValue,
    selectionMode,
    getOptionLabel,
    isLoading
  }

}
