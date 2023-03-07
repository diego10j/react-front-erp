import { sendPost } from '../serviceRequest';

/**
 * Llama al servicio borrarAuditoria
 * @returns
 */
export const borrarAuditoria = async () => {
  const body = {
    ide_usua: localStorage.getItem('ide_usua') || null
  };
  return sendPost('api/seguridad/borrarAuditoria', body);
};
