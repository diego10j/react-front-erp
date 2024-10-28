
import type { IUuid } from 'src/types/core';
import type { ListDataConfig } from 'src/core/types';
import type { IgetSaldo, IideInarti, IgetClientes, IgetTrnPeriodo, IgetActividades, IgetTrnProducto, IgetVentasProducto, IgetComprasProducto, IgetUltimosPreciosCompras, IgetVariacionPreciosCompras } from 'src/types/inventario/productos';

import { useMemoizedSendPost, useGetListDataValues, useGetTableQueryByUuid } from '../core';

const endpoints = {
  productos: {
    getProductos: '/api/inventario/productos/getProductos',
    getCatalogoProductos: '/api/inventario/productos/getCatalogoProductos',
    getProducto: '/api/inventario/productos/getProducto',
    getTrnProducto: '/api/inventario/productos/getTrnProducto',
    getSaldo: '/api/inventario/productos/getSaldo',
    getSaldoPorBodega: '/api/inventario/productos/getSaldoPorBodega',
    getUltimosPreciosCompras: '/api/inventario/productos/getUltimosPreciosCompras',
    getComprasMensuales: '/api/inventario/productos/getComprasMensuales',
    getVentasMensuales: '/api/inventario/productos/getVentasMensuales',
    getTopProveedores: '/api/inventario/productos/getTopProveedores',
    getSumatoriaTrnPeriodo: '/api/inventario/productos/getSumatoriaTrnPeriodo',
    getActividades: '/api/inventario/productos/getActividades',
    getVariacionPreciosCompras: '/api/inventario/productos/getVariacionPreciosCompras',
    getComprasProducto: '/api/inventario/productos/getComprasProducto',
    getVentasProducto: '/api/inventario/productos/getVentasProducto',
    getTopClientes: '/api/inventario/productos/getTopClientes',
    getClientes: '/api/inventario/productos/getClientes',
    getProveedores: '/api/inventario/productos/getProveedores',
    getProformasMensuales: '/api/inventario/productos/getProformasMensuales',
    chartVentasPeriodo: '/api/inventario/productos/chartVentasPeriodo',
    chartVariacionPreciosCompras: '/api/inventario/productos/chartVariacionPreciosCompras',
  }
};

// ====================== ListData =========================

export const listDataCategorias: ListDataConfig = { tableName: 'inv_categoria', primaryKey: 'ide_incate', columnLabel: 'nombre_incate' };
/**
 * Retorna las categorias
 * @returns
 */
export function useGetListDataCategorias() {
  return useGetListDataValues(listDataCategorias);
}

export const listDataUnidadesMedida: ListDataConfig = { tableName: 'inv_unidad', primaryKey: 'ide_inuni', columnLabel: 'nombre_inuni' };
/**
 * Retorna las unidades de medida
 * @returns
 */
export function useGetListDataUnidadesMedida() {
  return useGetListDataValues(listDataUnidadesMedida);
}

export const listDataAreasAplica: ListDataConfig = { tableName: 'inv_area', primaryKey: 'ide_inare', columnLabel: 'nombre_inare' };
/**
 * Retorna las áreas de aplicacion
 * @returns
 */
export function useGetListDataAreasAplica() {
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
 * Retorna TableQuery de un Usuario determindado
 * @param {uuid} id usuario
 * @returns
 */
export function useGetTableQueryProductoByUuid(uuid?: string) {
  const param = {
    tableName: 'inv_articulo',
    primaryKey: 'ide_inarti',
    uuid
  };
  return useGetTableQueryByUuid(param,)
}

/**
 * Retorna los datos de un producto
 * @param param
 * @returns
 */
export function useGetProducto(param: IUuid) {
  const endpoint = endpoints.productos.getProducto;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los datos de un producto
 * @param param
 * @returns
 */
export function useGetCatalogoProductos() {
  const endpoint = endpoints.productos.getCatalogoProductos;
  return useMemoizedSendPost(endpoint);
}

/**
 * Retorna las transacciones de un producto en un rango de fechas
 * @param param
 * @returns
 */
export function useGetTrnProducto(param: IgetTrnProducto) {
  const endpoint = endpoints.productos.getTrnProducto;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el saldo de un producto
 * @param param
 * @returns
 */
export function useGetSaldo(param: IgetSaldo) {
  const endpoint = endpoints.productos.getSaldo;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el saldo de un producto por cada bodega
 * @param param
 * @returns
 */
export function useGetSaldoPorBodega(param: IgetSaldo) {
  const endpoint = endpoints.productos.getSaldoPorBodega;
  return useMemoizedSendPost(endpoint, param);
}


/**
 * Retorna los precios de las últimas transacciones de compras
 * @param param
 * @returns
 */
export function useGetUltimosPreciosCompras(param: IgetUltimosPreciosCompras) {
  const endpoint = endpoints.productos.getUltimosPreciosCompras;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el total de ventas mensuales de un producto en un periodo determinado
 * @param param
 * @returns
 */
export function useGetVentasMensuales(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getVentasMensuales;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los 10 mejores proveedores de un producto en un periodo
 * @param param
 * @returns
 */
export function useGetTopProveedores(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getTopProveedores;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el total de compras mensuales de un producto en un periodo determinado
 * @param param
 * @returns
 */
export function useGetComprasMensuales(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getComprasMensuales;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna la sumatoria de compra/ventas en un perido
 * @param param
 * @returns
 */
export function useGetSumatoriaTrnPeriodo(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getSumatoriaTrnPeriodo;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna la sumatoria de compra/ventas en un perido
 * @param param
 * @returns
 */
export function useGetActividades(param: IgetActividades) {
  const endpoint = endpoints.productos.getActividades;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el porcentaje de variocion de compras de un producto en un rango de fechas
 * @param param
 * @returns
 */
export function useGetVariacionPreciosCompras(param: IgetVariacionPreciosCompras) {
  const endpoint = endpoints.productos.getVariacionPreciosCompras;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna las compras de un producto en un rango de fechas
 * @param param
 * @returns
 */
export function useGetComprasProducto(param: IgetComprasProducto) {
  const endpoint = endpoints.productos.getComprasProducto;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna las ventas de un producto en un rango de fechas
 * @param param
 * @returns
 */
export function useGetVentasProducto(param: IgetVentasProducto) {
  const endpoint = endpoints.productos.getVentasProducto;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los 10 mejores clientes de un producto en un periodo
 * @param param
 * @returns
 */
export function useGetTopClientes(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getTopClientes;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los clientes de un producto
 * @param param
 * @returns
 */
export function useGetClientes(param: IgetClientes) {
  const endpoint = endpoints.productos.getClientes;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los proveedores de un producto
 * @param param
 * @returns
 */
export function useGetProveedores(param: IideInarti) {
  const endpoint = endpoints.productos.getProveedores;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el total de proformas mensuales de un producto en un periodo determinado
 * @param param
 * @returns
 */
export function useGetProformasMensuales(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.getProformasMensuales;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna los graficos estadisticos de un producto en un periodo
 * @param param
 * @returns
 */
export function useChartVentasPeriodo(param: IgetTrnPeriodo) {
  const endpoint = endpoints.productos.chartVentasPeriodo;
  return useMemoizedSendPost(endpoint, param);
}

export function useChartVariacionPreciosCompras(param: IideInarti) {
  const endpoint = endpoints.productos.chartVariacionPreciosCompras;
  return useMemoizedSendPost(endpoint, param);
}
