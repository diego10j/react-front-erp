import {
    Autocomplete,
    TextField,
} from '@mui/material';

import { DropdownProps } from './types';


export default function Dropdown({

    label,
    useDropdown,
    onChange
}: DropdownProps) {

    const { options, setValue, getOptionLabel, loading, value } = useDropdown
    return (
        <Autocomplete
            size="small"
            fullWidth
            options={options}
            disablePortal
            value={value}
            getOptionLabel={getOptionLabel}
            loading={loading}
            onChange={(event, newValue: any) => {
                setValue((newValue === null ? '' : newValue?.value || ''))
                if (onChange) {
                    onChange();
                }
            }
            }
            isOptionEqualToValue={(_option: any, _value: string) => _option.value === _value}
            loadingText="Cargando..."
            noOptionsText="Sin opciones"
            sx={{ minWidth: 250 }}
            renderInput={(params) => <TextField {...params} label={label} placeholder="Seleccione..." />}
        />
    );
}
