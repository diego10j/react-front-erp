import useSWR from 'swr';
import { useMemo } from 'react';

import { ResponseSWR } from 'src/core/types/query';

import { useGetListDataValues } from './core';
import { endpoints, fetcherPost } from '../utils/axios';

// ----------------------------------------------------------------------
/**
 * Retorna el listado de productos
 * @returns
 */
export function useGetProductos() {
  const URL = endpoints.productos.getProductos;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherPost);

  const memoizedValue: ResponseSWR = useMemo(
    () => ({
      dataResponse: (data) || [],
      isLoading,
      error,
      isValidating
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}


/**
 * Retorna las categorias
 * @returns
 */
export function useListDataCategorias() {
  return useGetListDataValues('inv_categoria', 'ide_incate', 'nombre_incate');
}

/**
 * Retorna las unidades de medida
 * @returns
 */
export function useListDataUnidadesMedida() {
  return useGetListDataValues('inv_unidad', 'ide_inuni', 'nombre_inuni');
}

/**
 * Retorna las áreas de aplicacion
 * @returns
 */
export function useListDataAreasAplica() {
  return useGetListDataValues('inv_area', 'ide_inare', 'nombre_inare');
}

/**
 * Retorna las transacciones de un producto en un rango de fechas
 * @param ide_inarti
 * @param fechaInicio
 * @param fechaFin
 * @returns
 */
export function useGetTrnProducto(ide_inarti: number, fechaInicio: Date, fechaFin: Date) {
  const body = {
    ide_inarti,
    fechaInicio,
    fechaFin
  };
  const endpoint = endpoints.productos.getTrnProducto;
  const URL = body ? [endpoint, { params: body }] : endpoint;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherPost);

  const memoizedValue: ResponseSWR = useMemo(
    () => ({
      dataResponse: (data) || [],
      isLoading,
      error,
      isValidating
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
