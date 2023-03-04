import { EventInput } from '@fullcalendar/core';

// ----------------------------------------------------------------------

export type ICalendarViewValue = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

export type ICalendarEvent = {
  title: string;
  description: string;
  color: string;
  allDay: boolean;
  start: Date | string | null;
  end: Date | string | null;
};

export type ICalendarState = {
  isLoading: boolean;
  error: Error | string | null;
  events: EventInput[];
};
