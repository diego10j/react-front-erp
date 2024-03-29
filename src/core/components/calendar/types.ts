// ----------------------------------------------------------------------

export type UseCalendarRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  maxStartDate?: Date | undefined;
  minStartDate?: Date | undefined;
  maxEndDate?: Date | undefined;
  minEndDate?: Date | undefined;
  onChangeStartDate: (newValue: Date | null) => void;
  onChangeEndDate: (newValue: Date | null) => void;
  //
  onReset?: VoidFunction;
  //
  isSelected?: boolean;
  isError?: boolean;
  //
  label?: string;

  //
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
};


export type CalendarRangePickerProps = {
  useCalendarRangePicker: UseCalendarRangePickerProps;
  //
  title?: string;
  variant?: 'calendar' | 'input';
};
