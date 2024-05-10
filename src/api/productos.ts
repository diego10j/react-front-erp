
import { ListDataConfig } from 'src/core/types';

import { IgetSaldo, IgetTrnProducto, IgetUltimosPreciosCompras, IgetVentasMensuales, IgetComprasMensuales } from 'src/types/productos';

import { endpoints } from '../utils/axios';
import { useMemoizedValue, useGetListDataValues } from './core';



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
  const URL = endpoints.productos.getProductos;
  return useMemoizedValue(URL);
}

/**
 * Retorna las transacciones de un producto en un rango de fechas
 * @param body
 * @returns
 */
export function useGetTrnProducto(body: IgetTrnProducto) {
  const endpoint = endpoints.productos.getTrnProducto;
  const URL = body ? [endpoint, { params: body }] : endpoint;
  return useMemoizedValue(URL);
}

/**
 * Retorna el saldo de un producto
 * @param body
 * @returns
 */
export function useGetSaldo(body: IgetSaldo) {
  const endpoint = endpoints.productos.getSaldo;
  const URL = body ? [endpoint, { params: body }] : endpoint;
  return useMemoizedValue(URL);
}

/**
 * Retorna los precios de las últimas transacciones de compras
 * @param body
 * @returns
 */
export function useGetUltimosPreciosCompras(body: IgetUltimosPreciosCompras) {
  const endpoint = endpoints.productos.getUltimosPreciosCompras;
  const URL = body ? [endpoint, { params: body }] : endpoint;
  return useMemoizedValue(URL);
}

/**
 * Retorna el total de ventas mensuales de un producto en un periodo determinado
 * @param body
 * @returns
 */
export function useGetVentasMensuales(body: IgetVentasMensuales) {
  const endpoint = endpoints.productos.getVentasMensuales;
  const URL = body ? [endpoint, { params: body }] : endpoint;
  return useMemoizedValue(URL);
}

/**
 * Retorna el total de compras mensuales de un producto en un periodo determinado
 * @param body
 * @returns
 */
export function useGetComprasMensuales(body: IgetComprasMensuales) {
  const endpoint = endpoints.productos.getComprasMensuales;
  const URL = body ? [endpoint, { params: body }] : endpoint;
  return useMemoizedValue(URL);
}
