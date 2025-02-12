import { useState, useCallback } from 'react';
// import { getYear, isBefore, isSameDay, isSameMonth } from 'date-fns';

// import { FORMAT_DATE_FRONT } from '../../../config-global';
import type { IDatePickerControl } from 'src/types/common';

// utils


import { fIsAfter, fDateRangeShortLabel } from 'src/utils/format-time';

//
import type { UseCalendarRangePickerProps } from './types';

// ----------------------------------------------------------------------

type ReturnType = UseCalendarRangePickerProps;

export default function useCalendarRangePicker(start: IDatePickerControl, end: IDatePickerControl): ReturnType {


  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);

  const error = fIsAfter(startDate, endDate);

  // const currentYear = new Date().getFullYear();

  // const startDateYear = startDate ? getYear(startDate) : null;

  // const endDateYear = endDate ? getYear(endDate) : null;

  // const isCurrentYear = currentYear === startDateYear && currentYear === endDateYear;

  // const isSameDays =    startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  // const isSameMonths =     startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  // const standardLabel = `${fDate(startDate)} - ${fDate(endDate)}`;

  // const getLabel = () => `${fDate(startDate, FORMAT_DATE_FRONT)} - ${fDate(endDate, FORMAT_DATE_FRONT)}`;

  const onChangeStartDate = useCallback((newValue: IDatePickerControl) => {
    setStartDate(newValue);
  }, []);

  const onChangeEndDate = useCallback(
    (newValue: IDatePickerControl) => {
      if (error) {
        setEndDate(null);
      }
      setEndDate(newValue);
    },
    [error]
  );

  const onReset = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    //
    onReset,
    //
    isSelected: !!startDate && !!endDate,
    //
    label: fDateRangeShortLabel(startDate, endDate, true),
    //
    setStartDate,
    setEndDate
  };
}
