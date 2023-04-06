import React from 'react';
import {
    Select,
    OutlinedInput,
    MenuItem,
} from '@mui/material';

import { DropdownProps } from './types';


export default function Dropdown({
    options,
    value,
    selectionMode,
    loading
}: DropdownProps) {
    return (

        <Select
            size="small"
            value={value}
            input={<OutlinedInput label="Status" />}
        >
            {options.map((option) => (
                <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                        p: 0,
                        mx: 1,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                    }}
                >
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
}
