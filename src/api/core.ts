import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { endpoints, fetcherPost, defaultParams } from 'src/utils/axios';

import { ResponseSWR,ListDataConfig } from 'src/core/types';

import { ISave, IFindByUuid } from 'src/types/core';

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

/**
 * Retorna la data de una llama mediate axios a un servicio POST
 * @param {string} nombreServicio
 * @param {Array} param
 * @returns
 */
export const sendPost = async (endpoint: string, param: any = {}) => {
  const body = {
    ...param,
    ...defaultParams()
  };
  return axiosInstance.post(endpoint, body);
};

// ----------------------------------------------------------------------


/**
 * Busca un registro de una tabla por su uuid
 * @param tableName
 * @param uuid
 * @param columns
 * @returns
 */
export function useFindByUuid(body: IFindByUuid): ResponseSWR {
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




/**
 *
 * @param body
 * @returns
 */
export const save = async (body: ISave) => {
  const endpoint = endpoints.core.save;
  return sendPost(endpoint, body);
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


