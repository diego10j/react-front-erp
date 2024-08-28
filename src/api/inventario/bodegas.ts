import { IgetMovimientos, IgetMovimientosBodega } from '../../types/inventario/bodegas';
import { useMemoizedSendPost } from '../core';

const endpoints = {

  bodegas: {
    getBodegas: '/api/inventario/bodegas/getBodegas',
    getMovimientos: '/api/inventario/bodegas/getMovimientos',
    getMovimientosBodega: '/api/inventario/bodegas/getMovimientosBodega',
    getListDataBodegas: '/api/inventario/bodegas/getListDataBodegas',
  }
};

// ====================== ListData =========================

/**
 * Retorna las bodegas de una empresa
 * @returns
 */
export function useGetListDataBodegas() {
  const endpoint = endpoints.bodegas.getListDataBodegas;
  return useMemoizedSendPost(endpoint, {}, false);
}

// =========================================================

/**
 * Retorna las bodegas
 * @returns
 */
export function useGetBodegas() {
  const endpoint = endpoints.bodegas.getBodegas;
  return useMemoizedSendPost(endpoint);
}


/**
 * Retorna los moviminetos de invetario
 * @param param
 * @returns
 */
export function useGetMovimientos(param: IgetMovimientos) {
  const endpoint = endpoints.bodegas.getMovimientos;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los moviminetos de invetario por bodega
 * @param param
 * @returns
 */
export function useGetMovimientosBodega(param: IgetMovimientosBodega) {
  const endpoint = endpoints.bodegas.getMovimientosBodega;
  return useMemoizedSendPost(endpoint, param);
}
