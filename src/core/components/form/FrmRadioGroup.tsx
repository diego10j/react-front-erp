import React from 'react';
// form
import { Controller, useFormContext } from 'react-hook-form';

import {
    Radio,
    FormLabel,
    RadioGroup,
    FormControl,
    FormHelperText,
    RadioGroupProps,
    FormControlLabel,
} from '@mui/material';

import { Column } from '../../types';
import { toTitleCase } from '../../../utils/stringUtil';
// @mui

// ----------------------------------------------------------------------

type Props = RadioGroupProps & {
    column: Column;
    spacing?: number;
    helperText?: React.ReactNode;
};

export default function FrmRadioGroup({
    row,
    column,
    spacing,
    helperText,
    ...other
}: Props) {
    const { control } = useFormContext();

    const labelledby = column.label ? `${column.name}-${column.label}` : '';

    return (
        <Controller
            name={column.name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl component="fieldset">
                    {column.label && (
                        <FormLabel component="legend" id={labelledby} sx={{ typography: 'body2' }}>
                            {toTitleCase(column.label)}
                        </FormLabel>
                    )}
                    {column.radioGroup && (
                        <RadioGroup {...field} aria-labelledby={labelledby} row={row} {...other}>
                            {column?.radioGroup.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                    sx={{
                                        '&:not(:last-of-type)': {
                                            mb: spacing || 0,
                                        },
                                        ...(row && {
                                            mr: 0,
                                            '&:not(:last-of-type)': {
                                                mr: spacing || 2,
                                            },
                                        }),
                                    }}
                                />
                            ))}
                        </RadioGroup>
                    )}
                    {(!!error || helperText) && (
                        <FormHelperText error={!!error} sx={{ mx: 0 }}>
                            {error ? error?.message : helperText}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
}
