import useSWR from 'swr';
import { useMemo } from 'react';

import { ListDataConfig } from 'src/core/types';
import { ResponseSWR } from 'src/core/types/query';

import { IgetTrnProducto } from 'src/types/productos';

import { useGetListDataValues } from './core';
import { endpoints, fetcherPost } from '../utils/axios';


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

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcherPost);

  const memoizedValue: ResponseSWR = useMemo(
    () => ({
      dataResponse: (data) || [],
      isLoading,
      error,
      isValidating,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}

/**
 * Retorna las transacciones de un producto en un rango de fechas
 * @param ide_inarti
 * @param fechaInicio
 * @param fechaFin
 * @returns
 */
export function useGetTrnProducto(body: IgetTrnProducto) {

  const endpoint = endpoints.productos.getTrnProducto;
  const URL = body ? [endpoint, { params: body }] : endpoint;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcherPost);

  const memoizedValue: ResponseSWR = useMemo(
    () => ({
      dataResponse: (data) || [],
      isLoading,
      error,
      isValidating,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );
  return memoizedValue;
}
