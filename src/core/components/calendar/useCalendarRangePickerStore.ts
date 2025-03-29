// stores/calendarRangePickerStore.ts
import type { Dayjs } from 'dayjs';

import { create } from 'zustand';

interface CalendarRangePickerState {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  error: boolean;
  actions: {
    setStartDate: (date: Dayjs | null) => void;
    setEndDate: (date: Dayjs | null) => void;
    resetDates: () => void;
    validateDates: (start: Dayjs | null, end: Dayjs | null) => boolean;
  };
}

export const useCalendarRangePickerStore = create<CalendarRangePickerState>((set, get) => ({
  startDate: null,
  endDate: null,
  error: false,
  actions: {
    setStartDate: (date) => {
      const currentEnd = get().endDate;
      const error = date && currentEnd ? date.isAfter(currentEnd) : false;

      set({
        startDate: date,
        endDate: error ? null : currentEnd,
        error
      });
    },
    setEndDate: (date) => {
      const currentStart = get().startDate;
      const error = currentStart && date ? currentStart.isAfter(date) : false;

      set({
        endDate: error ? null : date,
        error
      });
    },
    resetDates: () => set({ startDate: null, endDate: null, error: false }),
    validateDates: (start, end) => start && end ? start.isAfter(end) : false
  }
}));
