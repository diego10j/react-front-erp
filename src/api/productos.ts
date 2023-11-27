import useSWR from 'swr';
import { useMemo } from 'react';

import { ResponseSWR } from 'src/core/types/query';

import { endpoints, fetcherPost } from '../utils/axios';

// ----------------------------------------------------------------------
/**
 * Recupera el listado de productos
 * @returns
 */
export function useGetProductos() {
  const URL = endpoints.productos.list;

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

