import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcherPost } from 'src/utils/axios';

import { ICalendarEvent } from 'src/types/calendar';

import { sendPost } from './core';

// ----------------------------------------------------------------------

const endpoints = {

  calendario: {
    getEventos: '/api/calendario/getEventos',
    createEvento: '/api/calendario/createEvento',
    updateEvento: '/api/calendario/updateEvento',
    deleteEvento: '/api/calendario/deleteEvento',
  }
};

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetEvents() {
  const URL = endpoints.calendario.getEventos;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherPost, options);

  const memoizedValue = useMemo(() => {
    const events = data?.rows.map((event: ICalendarEvent) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: (events as ICalendarEvent[]) || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.rows.length,
    };
  }, [data?.rows, isLoading, error, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  try {
    const URL = endpoints.calendario.createEvento;
    await sendPost(URL, eventData);

    /**
     * Work in local
     */
    mutate(
      endpoints.calendario.getEventos,
      (currentData: any) => {
        const events: ICalendarEvent[] = [...currentData.rows, eventData];

        return {
          rowCount: events.length,
          rows: events
        };
      },
      false
    );
  } catch (error) {
    console.error(error);
  }


}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  try {
    const URL = endpoints.calendario.updateEvento;
    await sendPost(URL, eventData);
    mutate(
      endpoints.calendario.getEventos,
      (currentData: any) => {
        const events: ICalendarEvent[] = currentData.rows.map((event: ICalendarEvent) =>
          event.id === eventData.id ? { ...event, ...eventData } : event
        );

        return {
          rowCount: events.length,
          rows: events
        };
      },
      false
    );
  } catch (error) {
    console.error(error);
  }

}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  try {
    const URL = endpoints.calendario.deleteEvento;
    const params = {
      id: eventId
    }
    await sendPost(URL, params);
    mutate(
      endpoints.calendario.getEventos,
      (currentData: any) => {
        const events: ICalendarEvent[] = currentData.rows.filter(
          (event: ICalendarEvent) => event.id !== eventId
        );

        return {
          rowCount: events.length,
          rows: events
        };
      },
      false
    );
  } catch (error) {
    console.error(error);
  }
}
