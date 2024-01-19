import { endpoints } from 'src/utils/axios';

import { Query } from '../core/types';
import { sendDelete } from '../core/services/serviceRequest';
import { addDaysDate, getDateFormat } from '../utils/format-time';

/**
 * Llama al servicio deleteEventosAuditoria
 * @returns
 */
export const deleteEventosAuditoria = async (fechaInicio: Date, fechaFin: Date, ide_auac: string[]) => {
  const URL = endpoints.audit.deleteEventosAuditoria;
  sendDelete(URL,
    {
      ide_auac,
      fechaInicio: getDateFormat(fechaInicio),
      fechaFin: getDateFormat(fechaFin)
    }
  );
}

export const getQueryEventosAuditoria = (fechaInicio?: Date, fechaFin?: Date): Query => {
  const URL = endpoints.audit.getQueryEventosAuditoria;
  fechaInicio = fechaInicio || addDaysDate(new Date(), -3);
  fechaFin = fechaFin || new Date();
  return {
    serviceName: URL,
    params: {
      // initial values
      fechaInicio: getDateFormat(fechaInicio),
      fechaFin: getDateFormat(fechaFin),
      ide_usua: null
    }
  }
}
