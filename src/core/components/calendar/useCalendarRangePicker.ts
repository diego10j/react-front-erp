import { useState } from 'react';
// import { getYear, isBefore, isSameDay, isSameMonth } from 'date-fns';
import { isBefore } from 'date-fns';

// utils
import { fDate } from '../../../utils/format-time';
//
import { UseCalendarRangePickerProps } from './types';
import { FORMAT_DATE_FRONT } from '../../../config-global';

// ----------------------------------------------------------------------

type ReturnType = UseCalendarRangePickerProps;

export default function useCalendarRangePicker(start: Date | null, end: Date | null): ReturnType {


  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);

  const isError =
    (startDate && endDate && isBefore(new Date(endDate), new Date(startDate))) || false;

  // const currentYear = new Date().getFullYear();

  // const startDateYear = startDate ? getYear(startDate) : null;

  // const endDateYear = endDate ? getYear(endDate) : null;

  // const isCurrentYear = currentYear === startDateYear && currentYear === endDateYear;

  // const isSameDays =    startDate && endDate ? isSameDay(new Date(startDate), new Date(endDate)) : false;

  // const isSameMonths =     startDate && endDate ? isSameMonth(new Date(startDate), new Date(endDate)) : false;

  // const standardLabel = `${fDate(startDate)} - ${fDate(endDate)}`;

  const getLabel = () => `${fDate(startDate, FORMAT_DATE_FRONT)} - ${fDate(endDate, FORMAT_DATE_FRONT)}`;

  const onChangeStartDate = (newValue: Date | null) => {
    if (isError) {
      setStartDate(null);
    }
    setStartDate(newValue);
  };

  const onChangeEndDate = (newValue: Date | null) => {
    if (isError) {
      setEndDate(null);
    }
    setEndDate(newValue);
  };

  const onReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    //
    onReset,
    //
    isSelected: !!startDate && !!endDate,
    isError,
    //
    label: getLabel() || '',
    //
    setStartDate,
    setEndDate
  };
}
