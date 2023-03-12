import { sendPost } from '../serviceRequest';

/**
 * Llama al servicio borrarAuditoria
 * @returns
 */
// export const borrarAuditoria = async () => {
// const body = {
// ide_usua: localStorage.getItem('ide_usua') || null
// };
// return sendPost('api/seguridad/borrarAuditoria', body);
// };


export const getEventosAuditoria = async (fechaInicio: string, fechaFin: string) => {
  const params = {
    fechaInicio,
    fechaFin
  };
  return sendPost('api/audit/eventos-auditoria', params);
};
