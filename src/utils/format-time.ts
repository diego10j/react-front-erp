import { format, getTime, addDays, isValid, parseISO, formatISO, formatDistanceToNow } from 'date-fns';

// config
import { FORMAT_DATE_BD, FORMAT_TIME_BD, FORMAT_DATE_FRONT } from '../config-global';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null | undefined;

export function fDate(date: InputValue, newFormat?: string): string {
  const fm = newFormat || 'dd MMM yyyy';

  // Si date es null o undefined, retornamos una cadena vacía
  if (date === null || date === undefined) {
    return '';
  }

  let currentDate: Date;

  if (date instanceof Date) {
    // Si date es una instancia de Date, lo asignamos directamente
    currentDate = date;
  } else if (typeof date === 'string') {
    // Intentamos parsear date como una fecha ISO usando parseISO
    try {
      currentDate = parseISO(date);
    } catch (error) {
      console.error('Error parsing date string:', error);
      return '';
    }
  } else if (typeof date === 'number') {
    // Si date es un número válido, creamos un objeto Date con ese número
    currentDate = new Date(date);
  } else {
    // Si date no es ninguno de los tipos esperados, retornamos una cadena vacía
    return '';
  }

  // Verificamos si la fecha obtenida es válida
  if (!isValid(currentDate)) {
    console.error('Invalid date:', currentDate);
    return '';
  }

  // Formateamos y retornamos la fecha formateada
  return format(currentDate, fm);
}

export function fTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'p';
  return fDate(date, fm)
}



export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd MMM yyyy p';
  return fDate(date, fm)
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
      addSuffix: true,
    })
    : '';
}

export function isBetween(inputDate: Date | string | number, startDate: Date, endDate: Date) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate: Date | null, endDate: Date | null) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}


/**
 * Convierte una fecha en string a Objeto Date
 * @param date
 * @param newFormat
 * @returns
 */
export function toDate(date: string, newFormat?: string): Date {
  const parsedDate = parseISO(date);

  if (isValid(parsedDate)) {
    throw new Error(`Invalid date string: ${date}`);
  }

  const fm = newFormat || FORMAT_DATE_BD;
  return new Date(format(parsedDate, fm));
}

export function convertStringToDateISO(date: string | null | undefined): Date | undefined {
  if (date) {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return undefined;
}


/**
 * Convierte un objeto Date a una cadena en formato ISO.
 *
 * @param {Date} date - El objeto Date a convertir.
 * @returns {string} La cadena en formato ISO.
 */
export function convertDateToISO(date: Date): string | undefined {
  if (!(date instanceof Date) || !isValid(date)) {
    return undefined;
  }

  try {
    return formatISO(date);
  } catch (error) {
    return undefined;
  }
}

/**
 * Da formato a una Fecha
 * @param date
 * @param newFormat
 * @returns
 */
export function getDateFormat(date: InputValue, newFormat?: string): string {
  const fm = newFormat || FORMAT_DATE_BD;
  return date ? format(new Date(date), fm) : '';
}

export function getCurrentDate(): Date {
  const date = getDateFormat(new Date());
  return toDate(date);
}

export function getDateFormatFront(date: InputValue): string {
  return getDateFormat(date, FORMAT_DATE_FRONT);
}
export function getTimeFormat(date: InputValue): string {
  return getDateFormat(date, FORMAT_TIME_BD);
}


export function getDateTimeFormat(date: InputValue): string {
  return getDateFormat(date, `${FORMAT_DATE_BD} ${FORMAT_TIME_BD}`);
}


/**
 * Suma días a una Fecha
 * @param date
 * @param numDays
 * @param newFormat
 * @returns
 */
export function addDaysDate(date: Date, numDays: number, newFormat?: string): Date {
  const fm = newFormat || FORMAT_DATE_BD;
  return addDays(toDate(getDateFormat(date, fm)), numDays);
}

export function isValidDate(date: any): boolean {
  return isValid(date);
}

export function getYear(date?: Date): number {
  const d = date || new Date();
  return d.getFullYear();
}

