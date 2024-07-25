import type {
  SelectChangeEvent
} from '@mui/material';

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
  ...otherProps
}: DropdownProps) {

  const { options, setValue, isLoading, value, initialize } = useDropdown

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    if (onChange)
      onChange(event.target.value);
  };

  return (
    <>
      {(isLoading || initialize === false) ? (
        <Skeleton variant="rounded" height={55} />
      ) : (

        <FormControl fullWidth disabled={disabled}>
          {label && <InputLabel>{label}</InputLabel>}
          <Select
            value={value || ''}
            label={label}
            onChange={handleChange}
            {...otherProps}
          >

            {(showEmptyOption) && (
              <MenuItem value=""> <em>(Null)</em></MenuItem>
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
