import { format, getTime, formatDistanceToNow, parse, addDays, isValid } from 'date-fns';
import { toString } from './commonUtil';
// config
import { FORMAT_DATE_BD, FORMAT_TIME_BD, FORMAT_DATE_FRONT } from '../config-global';


type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || FORMAT_DATE_BD;

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || FORMAT_DATE_BD.concat(' ').concat(FORMAT_TIME_BD);

  return date ? format(new Date(date), fm) : '';
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

/**
 * Convierte una fecha en string a Objeto Date
 * @param date 
 * @param newFormat 
 * @returns 
 */
export function toDate(date: string, newFormat?: string): Date {
  const fm = newFormat || FORMAT_DATE_BD;
  return parse(date, toString(fm), new Date());
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

export function getDateFormatFront(date: InputValue): string {
  return getDateFormat(date, FORMAT_DATE_FRONT);
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

