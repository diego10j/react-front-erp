import useSWR from 'swr';
import { useMemo } from 'react';

import { ResponseSWR } from 'src/core/types/query';

import { endpoints, fetcherPost } from '../utils/axios';

// ----------------------------------------------------------------------

export function useCallPost(endpoint: string, body = {}) {

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
export function useFindByUuid(tableName: string, uuid: string, columns?: string) {
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

