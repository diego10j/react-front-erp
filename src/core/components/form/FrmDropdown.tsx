import React, { useState, useEffect } from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import { TextField, Autocomplete, FormControlLabelProps } from '@mui/material';

import { Column, Options } from '../../types';
import { toTitleCase } from '../../../utils/stringUtil';


// ----------------------------------------------------------------------
interface FrmDropdownProps extends Omit<FormControlLabelProps, 'control'> {
  column: Column;
  helperText?: React.ReactNode;
}

export default function FrmDropdown({ column, helperText, ...other }: FrmDropdownProps) {

  const { control, setValue } = useFormContext();
  const [listOptions, setListOptions] = useState<Options[]>([]);

  const { dropDown, isLoading, label, name, onChange } = column;

  useEffect(() => {
    console.log(dropDown);
    if (dropDown) {
      setListOptions(dropDown);
    }
  }, [dropDown]);


  const getOptionLabel = (option: Options) => {
    if (typeof option === 'string') {
      // Busca el valor en el listado
      if (listOptions.length > 0 && option) {
        const search: any = listOptions.find((_element: any) => _element.value === option);
        if (search) return search.label || '';
      }
      return '';
    }
    return option.label || '';
  }



  return (
    <Controller
      name={name}
      defaultValue=""
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          size="small"
          loading={isLoading}
          loadingText="Cargando..."
          options={listOptions}
          noOptionsText="Sin opciones"
          fullWidth
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option: any, value: string) => option.value === value}
          onChange={(event, newValue: any) => {
            setValue(name, (newValue === null ? '' : newValue?.value || ''), { shouldValidate: true })
            if (onChange) {
              onChange();
            }
          }
          }
          renderInput={(params) => (
            <TextField
              label={toTitleCase(label)}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
        />
      )}
    />
  );
}
