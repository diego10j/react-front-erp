import type { IDatePickerControl } from './common';
// ----------------------------------------------------------------------


export type ICalendarFilters = {
  colors: string[];
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};


export type ICalendarDate = string | number;

export type ICalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarRange = { start: ICalendarDate; end: ICalendarDate } | null;

export type ICalendarEvent = {
  id: string;
  color: string;
  title: string;
  allday: boolean;
  description: string;
  end: ICalendarDate;
  start: ICalendarDate;
  ide_usua?: number,
  ide_cale?: number,
  publico_cale?: boolean,
  notificar_cale?: boolean
};
