import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcherPost, defaultParams } from 'src/utils/axios';

import { ResponseSWR, ListDataConfig } from 'src/core/types';

import { ISave, IFindByUuid } from 'src/types/core';

// ----------------------------------------------------------------------

/**
 * Retorna el ResponseSWR de una llamada a un servicio POST
 */
export function useMemoizedSendPost(endpoint: string, param: object = {}, revalidate: boolean = true): ResponseSWR {

  const body = {
    ...param,
    ...defaultParams()
  };

  const options = {
    revalidateIfStale: revalidate,
    revalidateOnFocus: revalidate,
    revalidateOnReconnect: revalidate,
  };

  const URL = body ? [endpoint, { params: body }] : endpoint;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcherPost, options);

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
 * Retorna la data de una llama mediate axios a un servicio POST
 * @param {string} endpoint
 * @param {Array} param
 * @returns
 */
export const sendPost = (endpoint: string, param: any = {}) => {
  const body = {
    ...param,
    ...defaultParams()
  };
  return axiosInstance.post(endpoint, body);
};

// ----------------------------------------------------------------------


/**
 * Busca un registro de una tabla por su uuid
 * @param param
 * @param revalidate
 * @returns
 */
export function useFindByUuid(param: IFindByUuid, revalidate: boolean = true): ResponseSWR {
  const endpoint = endpoints.core.findByUuid;
  return useMemoizedSendPost(endpoint, param, revalidate);
}

/**
 * Retorna la lista de valores para un Dropdown
 * @param tableName
 * @param primaryKey
 * @param columnLabel
 * @returns
 */
export function useGetListDataValues(param: ListDataConfig, revalidate: boolean = false): ResponseSWR {
  const endpoint = endpoints.core.getListDataValues;
  return useMemoizedSendPost(endpoint, param, revalidate);
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
  const param = {
    tableName,
    primaryKey,
    columns,
    where
  };
  return useMemoizedSendPost(endpoint, param);
}




/**
 *
 * @param body
 * @returns
 */
export const save = async (param: ISave) => {
  const endpoint = endpoints.core.save;
  return sendPost(endpoint, param);
};


/**
 * Retorna maximo secuencial de una tabla
 * @param tableName
 * @param primaryKey
 * @param numberRowsAdded
 * @returns
 */
export const getSeqTable = async (tableName: string, primaryKey: string, numberRowsAdded: number): Promise<number> => {
  let seq: number = 1;
  const endpoint = endpoints.core.getSeqTable;
  if (numberRowsAdded > 0) {
    try {
      const param = {
        tableName,
        primaryKey,
        numberRowsAdded
      }
      const result = await sendPost(endpoint, param);
      seq = result.data.seqTable;
    } catch (error) {
      throw new Error(`Error en el servicio getSeqTable ${error}`);
    }
  }
  return seq;
}


