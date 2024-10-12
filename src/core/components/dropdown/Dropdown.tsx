import type {
  SelectChangeEvent
} from '@mui/material';

import { useCallback } from 'react';

import {
  Select,
  Divider,
  MenuItem,
  Skeleton,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';

import type { DropdownProps } from './types';

export default function Dropdown({

  label,
  disabled = false,
  showEmptyOption = true,
  helperText,
  useDropdown,
  onChange,
  emptyLabel = "(Null)",
  ...otherProps
}: DropdownProps) {

  const { options, setValue, isLoading, value, initialize } = useDropdown


  const handleChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      setValue(event.target.value);
      if (onChange)
        onChange(event.target.value);
    },
    [onChange, setValue]
  );


  return (
    <>
      {(isLoading || initialize === false) ? (
        <Skeleton variant="rounded" height={40} />
      ) : (

        <FormControl fullWidth disabled={disabled}>
          {label && <InputLabel>{label}</InputLabel>}
          <Select
            value={value || ''}
            label={label}
            onChange={handleChange}
            size="small"
            {...otherProps}
          >

            {(showEmptyOption) && (
              <MenuItem value=""> <em>{emptyLabel}</em></MenuItem>
            )}
            {(showEmptyOption) && (
              <Divider sx={{ borderStyle: 'dashed' }} />
            )}
            {options.map((option) => (
              < MenuItem key={option.value} value={option.value} >
                {option.label}
              </MenuItem>
            ))}


          </Select>
          {helperText && <FormHelperText>helperText</FormHelperText>}

        </FormControl>



      )}
    </>
  );
}
