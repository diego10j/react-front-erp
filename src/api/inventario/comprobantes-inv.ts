
import { useMemoizedSendPost } from '../core';
import { IgetComprobantesInventario, IideIncci } from '../../types/inventario/comprobantes-inv';

const endpoints = {

  comprobantes: {
    getComprobantesInventario: '/api/inventario/comprobantes/getComprobantesInventario',
    getDetComprobanteInventario: '/api/inventario/comprobantes/getDetComprobanteInventario',
    getCabComprobanteInventario: '/api/inventario/comprobantes/getCabComprobanteInventario',
    getListDataEstadosComprobantes: '/api/inventario/comprobantes/getListDataEstadosComprobantes',
  }
};

// ====================== ListData =========================

/**
 * Retorna las bodegas de una empresa
 * @returns
 */
export function useGetListDataEstadosComprobantes() {
  const endpoint = endpoints.comprobantes.getListDataEstadosComprobantes;
  return useMemoizedSendPost(endpoint, {}, false);
}

// =========================================================


/**
 * Retorna los comprobantes de invetario
 * @param param
 * @returns
 */
export function useGetComprobantesInventario(param: IgetComprobantesInventario) {
  const endpoint = endpoints.comprobantes.getComprobantesInventario;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el detalle de un comprobante
 * @param param
 * @returns
 */
 export function useGetDetComprobanteInventario(param: IideIncci) {
  const endpoint = endpoints.comprobantes.getDetComprobanteInventario;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna la cabecera de un comprobante
 * @param param
 * @returns
 */
 export function useGetCabComprobanteInventario(param: IideIncci) {
  const endpoint = endpoints.comprobantes.getCabComprobanteInventario;
  return useMemoizedSendPost(endpoint, param);
}
