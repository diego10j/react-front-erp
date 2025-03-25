import { IDeleteEventosAuditoria, IGetEventosAuditoria } from 'src/types/audit';
import { useMemoizedSendPost, sendPost } from './core';

const endpoints = {
  audit: {
    getEventosAuditoria: 'api/audit/getEventosAuditoria',
    deleteEventosAuditoria: 'api/audit/deleteEventosAuditoria',
  },
};


/**
 * Elimina eventos de auditoria en un rango de fechas
 * @returns
 */
export const deleteEventosAuditoria = async (param: IDeleteEventosAuditoria) => {
  const endpoint = endpoints.audit.deleteEventosAuditoria;
  sendPost(endpoint, param);
}


/**
 * Retorna los eventos de auditoria en un rango de fechas
 * @returns
 */
export function useGetEventosAuditoria(param: IGetEventosAuditoria) {
  const endpoint = endpoints.audit.getEventosAuditoria;
  return useMemoizedSendPost(endpoint, param);
}


