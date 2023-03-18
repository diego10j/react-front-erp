// ----------------------------------------------------------------------

export type CalendarRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  maxStartDate?: Date | undefined;
  minStartDate?: Date | undefined;
  maxEndDate?: Date | undefined;
  minEndDate?: Date | undefined;
  onChangeStartDate: (newValue: Date | null) => void;
  onChangeEndDate: (newValue: Date | null) => void;
  //
  open: boolean;
  onOpen?: VoidFunction;
  onClose: VoidFunction;
  onReset?: VoidFunction;
  //
  isSelected?: boolean;
  isError?: boolean;
  //
  label?: string;
  shortLabel?: string;
  //
  title?: string;
  variant?: 'calendar' | 'input';
  //
  setStartDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
};
