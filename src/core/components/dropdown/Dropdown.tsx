import {
    Autocomplete,
    TextField,
} from '@mui/material';

import { DropdownProps } from './types';


export default function Dropdown({
    options,
    value,
    setValue,
    label,
    selectionMode,
    loading
}: DropdownProps) {

    return (
        <Autocomplete
            size="small"
            fullWidth
            options={options}
            disablePortal
            value={value}
            onChange={(event: any, newValue: any | null) => {
                setValue(newValue);
            }}
            sx={{ minWidth: 250 }}
            renderInput={(params) => <TextField {...params} label={label} placeholder="Seleccione..." />}
        />
    );
}
