import { useMemoizedSendPost } from '../core';

import type { IgetMovimientos, IgetStockProductos } from '../../types/inventario/bodegas';

const endpoints = {

  bodegas: {
    getBodegas: '/api/inventario/bodegas/getBodegas',
    getBodega: '/api/inventario/bodegas/getBodega',
    getMovimientos: '/api/inventario/bodegas/getMovimientos',
    getStockProductos: '/api/inventario/bodegas/getStockProductos',
    getListDataBodegas: '/api/inventario/bodegas/getListDataBodegas',
    getListDataDetalleStock: '/api/inventario/bodegas/getListDataDetalleStock',

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

export function useGetListDataDetalleStock() {
  const endpoint = endpoints.bodegas.getListDataDetalleStock;
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

/**
 * Retorna el listado de productos con stock
 * @returns
 */
export function useGetStockProductos(param: IgetStockProductos) {
  const endpoint = endpoints.bodegas.getStockProductos;
  return useMemoizedSendPost(endpoint, param);
}

