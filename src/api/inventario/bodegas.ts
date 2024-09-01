import { useMemoizedSendPost } from '../core';

import type { IgetMovimientos } from '../../types/inventario/bodegas';

const endpoints = {

  bodegas: {
    getBodegas: '/api/inventario/bodegas/getBodegas',
    getBodega: '/api/inventario/bodegas/getBodega',
    getMovimientos: '/api/inventario/bodegas/getMovimientos',
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

export function useGetBodega(param: { ide: number }) {
  const endpoint = endpoints.bodegas.getBodega;
  return useMemoizedSendPost(endpoint, param);
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

