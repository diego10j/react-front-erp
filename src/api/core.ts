import useSWR from 'swr';
import { useMemo } from 'react';

import { ResponseSWR } from 'src/core/types/query';

import { endpoints, fetcherPost } from '../utils/axios';

// ----------------------------------------------------------------------

export function useCallPost(endpoint: string, body = {}): ResponseSWR {

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
 * Retorna la lista de valores para un Dropdown
 * @param tableName
 * @param primaryKey
 * @param columnLabel
 * @returns
 */
export function useGetListDataValues(tableName: string, primaryKey: string, columnLabel: string): ResponseSWR {
  const endpoint = endpoints.core.getListDataValues;
  const body = {
    tableName,
    primaryKey,
    columnLabel
  };
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
