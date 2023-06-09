import { sendDelete } from '../../core/services/serviceRequest';
import { Query } from '../../core/types';
import { getDateFormat, addDaysDate } from '../../utils/format-time';

/**
 * Llama al servicio deleteEventosAuditoria
 * @returns
 */
export const deleteEventosAuditoria = async (fechaInicio: Date, fechaFin: Date, ide_auac: string[]) =>
  sendDelete('api/audit/deleteEventosAuditoria',
    {
      ide_auac,
      fechaInicio: getDateFormat(fechaInicio),
      fechaFin: getDateFormat(fechaFin)
    }
  );

export const getQueryEventosAuditoria = (fechaInicio?: Date, fechaFin?: Date): Query => {
  fechaInicio = fechaInicio || addDaysDate(new Date(), -3);
  fechaFin = fechaFin || new Date();
  return {
    serviceName: 'api/audit/getEventosAuditoria',
    params: {
      // initial values
      fechaInicio: getDateFormat(fechaInicio),
      fechaFin: getDateFormat(fechaFin),
      ide_usua: null
    }
  }
}