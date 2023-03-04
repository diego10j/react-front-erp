import { llamarServicioPost } from '../servicioBase';

/**
 * Llama al servicio borrarAuditoria
 * @returns
 */
export const borrarAuditoria = async () => {
  const body = {
    ide_usua: localStorage.getItem('ide_usua') || null
  };
  return llamarServicioPost('api/seguridad/borrarAuditoria', body);
};
