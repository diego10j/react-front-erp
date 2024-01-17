import useSWR from 'swr';
import { useMemo } from 'react';

import { ListDataConfig } from 'src/core/types';
import { ResponseSWR } from 'src/core/types/query';

import { endpoints, fetcherPost } from '../utils/axios';

// ----------------------------------------------------------------------

/**
 * Retorna el ResponseSWR de una llamada a un servicio POST
 */
export function useMemoizedValue(URL: any): ResponseSWR {
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
// ----------------------------------------------------------------------


/**
 * Busca un registro de una tabla por su uuid
 * @param tableName
 * @param uuid
 * @param columns
 * @returns
 */
export function useFindByUuid(tableName: string, uuid: string, columns?: string): ResponseSWR {
  const body = {
    tableName,
    uuid,
    columns
  };
  const endpoint = endpoints.core.findByUuid;
  const URL = body ? [endpoint, { params: body }] : endpoint;

  return useMemoizedValue(URL);
}

/**
 * Retorna la lista de valores para un Dropdown
 * @param tableName
 * @param primaryKey
 * @param columnLabel
 * @returns
 */
export function useGetListDataValues(config: ListDataConfig): ResponseSWR {
  const endpoint = endpoints.core.getListDataValues;
  const URL = config ? [endpoint, { params: config }] : endpoint;
  return useMemoizedValue(URL);
}

/**
 * Retorna los registros de acuerdo a las condiciones enviadas
 * @param tableName
 * @param primaryKey
 * @param columns
 * @param where
 * @returns
 */
export function useGetTableQuery(tableName: string, primaryKey: string, columns?: string, where?: string): ResponseSWR {
  const endpoint = endpoints.core.getTableQuery;
  const body = {
    tableName,
    primaryKey,
    columns,
    where
  };

  const URL = body ? [endpoint, { params: body }] : endpoint;
  return useMemoizedValue(URL);
}
