import {
  Divider,
  MenuItem,
  TextField,
  Skeleton
} from '@mui/material';

import { DropdownProps } from './types';

export default function Dropdown({

  label,
  showEmptyOption = true,
  useDropdown,
  onChange
}: DropdownProps) {

  const { options, setValue, getOptionLabel, isLoading, value, initialize } = useDropdown
  return (
    <>
      {(isLoading || initialize === false) ? (
        <Skeleton variant="rounded" height={55} />
      ) : (
        <TextField
          select
          fullWidth
          onChange={onChange}
          SelectProps={{
            native: false,
            sx: { textTransform: 'capitalize' },
          }}
        >
          {(showEmptyOption) && (
            <MenuItem value="">(Null)</MenuItem>
          )}
          {(showEmptyOption) && (
            <Divider sx={{ borderStyle: 'dashed' }} />
          )}
          {options.map((option) => (
            < MenuItem key={option.value} value={option.value} >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    </>
  );
}
