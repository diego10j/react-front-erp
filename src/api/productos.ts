
import { ListDataConfig } from 'src/core/types';

import { IgetSaldo, IgetTrnProducto, IgetVentasMensuales, IgetComprasMensuales, IgetUltimosPreciosCompras } from 'src/types/productos';

import { endpoints } from '../utils/axios';
import { useMemoizedSendPost, useGetListDataValues } from './core';



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
export function useGetVentasMensuales(param: IgetVentasMensuales) {
  const endpoint = endpoints.productos.getVentasMensuales;
  return useMemoizedSendPost(endpoint, param);
}

/**
 * Retorna el total de compras mensuales de un producto en un periodo determinado
 * @param body
 * @returns
 */
export function useGetComprasMensuales(param: IgetComprasMensuales) {
  const endpoint = endpoints.productos.getComprasMensuales;
  return useMemoizedSendPost(endpoint, param);
}
