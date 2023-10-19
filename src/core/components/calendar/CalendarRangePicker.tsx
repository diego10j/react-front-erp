import { useState } from 'react';

import { DatePicker, DateCalendar } from '@mui/x-date-pickers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// @mui
import {
    Paper,
    Stack,
    Dialog,
    Button,
    TextField,
    IconButton,
    DialogTitle,
    DialogActions,
    DialogContent,
    FormHelperText,
    InputAdornment,
} from '@mui/material';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';

//
import { CalendarRangePickerProps } from './types';

// ----------------------------------------------------------------------

export default function CalendarRangePicker({
    title = 'Elige un rango de fechas',
    variant = 'input',
    //
    label,
    startDate,
    endDate,
    minStartDate,
    maxStartDate,
    minEndDate,
    maxEndDate,
    //
    onChangeStartDate,
    onChangeEndDate,

    //
    isError,
}: CalendarRangePickerProps) {
    const isDesktop = useResponsive('up', 'md');
    const [open, setOpen] = useState(false);

    const isCalendarView = variant === 'calendar';

    return (
        <>

            <TextField
                size="small"
                fullWidth
                variant="outlined"
                label="Rango de Fechas"
                value={label}
                sx={{ minWidth: 260 }}
                InputProps={{

                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setOpen(true)}
                                edge="end"
                            >
                                <CalendarMonthIcon width={24} />

                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Dialog
                fullWidth
                maxWidth={isCalendarView ? false : 'xs'}
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        ...(isCalendarView && {
                            maxWidth: 720,
                        }),
                    },
                }}
            >
                <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

                <DialogContent
                    sx={{
                        ...(isCalendarView &&
                            isDesktop && {
                            overflow: 'unset',
                        }),
                    }}
                >
                    <Stack
                        spacing={isCalendarView ? 3 : 2}
                        direction={isCalendarView && isDesktop ? 'row' : 'column'}
                        justifyContent="center"
                        sx={{
                            pt: 1,
                            '& .MuiCalendarPicker-root': {
                                ...(!isDesktop && {
                                    width: 'auto',
                                }),
                            },
                        }}
                    >
                        {isCalendarView ? (
                            <>
                                <Paper
                                    variant="outlined"
                                    sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
                                >
                                    <DateCalendar
                                        value={startDate}
                                        minDate={minStartDate}
                                        maxDate={maxStartDate}
                                        onChange={onChangeStartDate} />
                                </Paper>

                                <Paper
                                    variant="outlined"
                                    sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
                                >
                                    <DateCalendar
                                        value={endDate}
                                        minDate={minEndDate}
                                        maxDate={maxEndDate}
                                        onChange={onChangeEndDate} />
                                </Paper>
                            </>
                        ) : (
                            <>
                                <DatePicker
                                    label="Fecha Inicio"
                                    value={startDate}
                                    minDate={minStartDate}
                                    maxDate={maxStartDate}
                                    onChange={onChangeStartDate}
                                />

                                <DatePicker
                                    label="Fecha Fin"
                                    value={endDate}
                                    minDate={minEndDate}
                                    maxDate={maxEndDate}
                                    onChange={onChangeEndDate}
                                />
                            </>
                        )}
                    </Stack>

                    {isError && (
                        <FormHelperText error sx={{ px: 2 }}>
                            La Fecha Fin debe ser posterior a la Fecha de Inicio
                        </FormHelperText>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>

                    <Button disabled={isError} variant="contained" onClick={() => setOpen(false)}>
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
