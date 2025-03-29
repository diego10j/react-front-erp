// hooks/useCalendarRangePicker.ts
import type dayjs from 'dayjs';

import { useMemo } from 'react';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { useCalendarRangePickerStore } from './useCalendarRangePickerStore';


interface UseCalendarRangePickerProps {
  initialStart?: dayjs.Dayjs;
  initialEnd?: dayjs.Dayjs;
}

export default function useCalendarRangePicker({
  initialStart,
  initialEnd
}: UseCalendarRangePickerProps = {}) {
  // Selectores finos para optimizar renders
  const { startDate, endDate, error } = useCalendarRangePickerStore();
  const { setStartDate, setEndDate, resetDates, validateDates } = useCalendarRangePickerStore(
    (state) => state.actions
  );

  // Inicialización segura
  if ((initialStart || initialEnd) && !startDate && !endDate) {
    const hasError = validateDates(initialStart ?? null, initialEnd ?? null);
    useCalendarRangePickerStore.setState({
      startDate: initialStart || null,
      endDate: hasError ? null : initialEnd || null,
      error: hasError
    });
  }

  // Valores memoizados
  const isSelected = useMemo(() => !!startDate && !!endDate, [startDate, endDate]);
  const label = useMemo(
    () => fDateRangeShortLabel(startDate, endDate, true),
    [startDate, endDate]
  );

  return {
    startDate,
    endDate,
    onChangeStartDate: setStartDate,
    onChangeEndDate: setEndDate,
    onReset: resetDates,
    isSelected,
    label,
    isError: error,
    // Helpers adicionales
    isSameDay: (date: dayjs.Dayjs) => {
      if (!startDate || !endDate) return false;
      return date.isSame(startDate) || date.isSame(endDate) ||
             (date.isAfter(startDate) && date.isBefore(endDate));
    },
    isInRange: (date: dayjs.Dayjs) => {
      if (!startDate || !endDate) return false;
      return date.isAfter(startDate) && date.isBefore(endDate);
    }
  };
}
