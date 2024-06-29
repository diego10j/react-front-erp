
import type { ListDataConfig } from 'src/core/types';
import type { IgetSaldo, IgetTrnPeriodo, IgetTrnProducto, IgetUltimosPreciosCompras } from 'src/types/productos';

import { useMemoizedSendPost, useGetListDataValues } from './core';


const endpoints = {

  productos: {
    getProductos: '/api/productos/getProductos',
    getTrnProducto: '/api/productos/getTrnProducto',
    getSaldo: '/api/productos/getSaldo',
    getUltimosPreciosCompras: '/api/productos/getUltimosPreciosCompras',
    getComprasMensuales: '/api/productos/getComprasMensuales',
    getVentasMensuales: '/api/productos/getVentasMensuales',
    getTopProveedores: '/api/productos/getTopProveedores',
    getSumatoriaTrnPeriodo: '/api/productos/getSumatoriaTrnPeriodo'
  }
};

// ====================== ListData =========================

export const listDataCategorias: ListDataConfig = { tableName: 'inv_categoria', primaryKey: 'ide_incate', columnLabel: 'nombre_incate' };
/**
 * Retorna las categorias
 * @returns
 */
export function useListDataCategorias() {
  return useGetListDataValues(listDataCategorias);
}

export const listDataUnidadesMedida: ListDataConfig = { tableName: 'inv_unidad', primaryKey: 'ide_inuni', columnLabel: 'nombre_inuni' };
/**
 * Retorna las unidades de medida
 * @returns
 */
export function useListDataUnidadesMedida() {
  return useGetListDataValues(listDataUnidadesMedida);
}

export const listDataAreasAplica: ListDataConfig = { tableName: 'inv_area', primaryKey: 'ide_inare', columnLabel: 'nombre_inare' };
/**
 * Retorna las áreas de aplicacion
 * @returns
 */
export function useListDataAreasAplica() {
  return useGetListDataValues(listDataAreasAplica);
}

// ===============================================

/**
 * Retorna el listado de productos
 * @returns
 */
export function useGetProductos() {
  const endpoint = endpoints.productos.getProductos;
  return useMemoizedSendPost(endpoint);
}

/**
 * Retorna las transacciones de un producto en un rango de fechas
 * @param body
 * @returns
 */
export function useGetTrnProducto(param: IgetTrnProducto) {
  const endpoint = endpoints.productos.getTrnProducto;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el saldo de un producto
 * @param body
 * @returns
 */
export function useGetSaldo(param: IgetSaldo) {
  const endpoint = endpoints.productos.getSaldo;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los precios de las últimas transacciones de compras
 * @param body
 * @returns
 */
export function useGetUltimosPreciosCompras(param: IgetUltimosPreciosCompras) {
  const endpoint = endpoints.productos.getUltimosPreciosCompras;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el total de ventas mensuales de un producto en un periodo determinado
 * @param body
 * @returns
 */
export function useGetVentasMensuales(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getVentasMensuales;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los 10 mejores proveedores de un producto
 * @param param
 * @returns
 */
export function useGetTopProveedores(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getTopProveedores;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el total de compras mensuales de un producto en un periodo determinado
 * @param body
 * @returns
 */
export function useGetComprasMensuales(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getComprasMensuales;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna la sumatoria de compra/ventas en un perido
 * @param body
 * @returns
 */
export function useGetSumatoriaTrnPeriodo(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getSumatoriaTrnPeriodo;
  return useMemoizedSendPost(endpoint, param);
}
