import type {
  SelectChangeEvent
} from '@mui/material';

import { useCallback } from 'react';

import {
  Box,
  Chip,
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
  emptyLabel = '(Null)',
  placeholder = '',
  chip = true,
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

  const renderSelectedValue = useCallback((selected: string[]) => {
    const selectedItems = options.filter((item) => selected.includes(item.value));

    if (!selectedItems.length && placeholder) {
      return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
    }

    if (chip) {
      return (
        <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
          {selectedItems.map((item) => (
            <Chip
              key={item.value}
              size="small"
              variant="soft"
              label={item.label}
            />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(', ');
  }, [options, placeholder, chip]);

  return (
    <>
      {(isLoading || initialize === false) ? (
        <Skeleton variant="rounded" height={40} />
      ) : (
        <FormControl fullWidth disabled={disabled}>
          <InputLabel shrink htmlFor={labelId} >{label}</InputLabel>
          <Select
            multiple
            displayEmpty={!!placeholder}
            value={value || []}
            onChange={handleChange}
            size="small"
            input={<OutlinedInput label={label} />}
            inputProps={{ id: labelId, variant: "outlined" }}
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






