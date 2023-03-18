// @mui
import {
    Paper,
    Stack,
    Dialog,
    Button,
    TextField,
    DialogTitle,
    DialogActions,
    DialogContent,
    FormHelperText,
} from '@mui/material';
import { DatePicker, CalendarPicker } from '@mui/x-date-pickers';
// hooks
import useResponsive from '../../../hooks/useResponsive';
//
import { CalendarRangePickerProps } from './types';

// ----------------------------------------------------------------------

export default function CalendarRangePicker({
    title = 'Elige un rango de fechas',
    variant = 'input',
    //
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
    open,
    onClose,
    //
    isError,
}: CalendarRangePickerProps) {
    const isDesktop = useResponsive('up', 'md');

    const isCalendarView = variant === 'calendar';

    return (
        <Dialog
            fullWidth
            maxWidth={isCalendarView ? false : 'xs'}
            open={open}
            onClose={onClose}
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
                                <CalendarPicker
                                    date={startDate}
                                    minDate={minStartDate}
                                    maxDate={maxStartDate}
                                    onChange={onChangeStartDate} />
                            </Paper>

                            <Paper
                                variant="outlined"
                                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
                            >
                                <CalendarPicker
                                    date={endDate}
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
                                renderInput={(params) => <TextField {...params} />}
                            />

                            <DatePicker
                                label="Fecha Fin"
                                value={endDate}
                                minDate={minEndDate}
                                maxDate={maxEndDate}
                                onChange={onChangeEndDate}
                                renderInput={(params) => <TextField {...params} />}
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
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancelar
                </Button>

                <Button disabled={isError} variant="contained" onClick={onClose}>
                    Applicar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
