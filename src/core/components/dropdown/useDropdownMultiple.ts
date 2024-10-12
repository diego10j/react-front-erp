import { useState, useEffect } from 'react';

import type { Options } from '../../types';
import type { UseDropdownMultipleProps, UseDropdownMultipleReturnProps } from './types';

export default function UseDropdownMultiple(props: UseDropdownMultipleProps): UseDropdownMultipleReturnProps {


  const [value, setValue] = useState<string[] | undefined>(props.defaultValue || undefined);
  const [initialize, setInitialize] = useState(false);

  const { dataResponse: options, isLoading, mutate } = props.config;  // error, isValidating

  useEffect(() => {
    if (options) {
      if (initialize === false)
        setInitialize(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  /**
 * Actualiza la data
 */
  const onRefresh = () => {
    mutate();
  };

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
    getOptionLabel,
    isLoading,
    initialize,
    onRefresh
  }

}
