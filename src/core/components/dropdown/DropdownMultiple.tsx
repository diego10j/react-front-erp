import type {
  SelectChangeEvent
} from '@mui/material';

import { useCallback } from 'react';

import {
  Select,
  Divider,
  Checkbox,
  MenuItem,
  Skeleton,
  InputLabel,
  FormControl,
  OutlinedInput,
  FormHelperText
} from '@mui/material';

import type { DropdownMultipleProps } from './types';

export default function DropdownMultiple({

  label,
  id,
  disabled = false,
  showEmptyOption = true,
  helperText,
  useDropdownMultiple,
  onChange,
  emptyLabel = "(Null)",
  ...otherProps
}: DropdownMultipleProps) {

  const { options, setValue, isLoading, value, initialize } = useDropdownMultiple
  const labelId = `${id}-select-label`;

  const handleChange = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
      setValue(newValue);
      if (onChange)
        onChange(newValue);
    },
    [onChange, setValue]
  );

  const renderSelectedValue = useCallback(
    (selected: string[]) => selected
      .map((selectedValue) => {
        const option = options.find((opt) => opt.value === selectedValue);
        return option ? option.label : selectedValue;
      })
      .join(', '),
    [options] // Solo se recalcula si las opciones cambian
  );

  return (
    <>
      {(isLoading || initialize === false) ? (
        <Skeleton variant="rounded" height={40} />
      ) : (
        <FormControl fullWidth disabled={disabled}>

          <InputLabel htmlFor={labelId} sx={{ top: '-6px' }}>{label}</InputLabel>
          <Select
            multiple
            value={value || []}
            onChange={handleChange}
            size="small"
            input={<OutlinedInput label={label} />}
            inputProps={{ id: labelId, variant :"outlined"}}
            renderValue={renderSelectedValue}
            sx={{ textTransform: 'capitalize' }}
            {...otherProps}
          >
            {showEmptyOption && (
              <>
                <MenuItem value="">
                  <em>{emptyLabel}</em>
                </MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
              </>
            )}
            {options.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={value?.includes(option.value) || false}
                />

                {option.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>

      )}
    </>
  );
}






