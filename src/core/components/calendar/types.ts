import { IDatePickerControl } from '../../../types/common';
// ----------------------------------------------------------------------

export type UseCalendarRangePickerProps = {
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
  maxStartDate?: IDatePickerControl;
  minStartDate?: IDatePickerControl;
  maxEndDate?: IDatePickerControl;
  minEndDate?: IDatePickerControl;
  onChangeStartDate: (newValue: IDatePickerControl) => void;
  onChangeEndDate: (newValue: IDatePickerControl) => void;
  //
  onReset?: VoidFunction;
  //
  isSelected?: boolean;
  isError?: boolean;
  //
  label?: string;

  //
  setStartDate: React.Dispatch<React.SetStateAction<IDatePickerControl>>;
  setEndDate: React.Dispatch<React.SetStateAction<IDatePickerControl>>;
};


export type CalendarRangePickerProps = {
  useCalendarRangePicker: UseCalendarRangePickerProps;
  //
  title?: string;
  variant?: 'calendar' | 'input';
};
