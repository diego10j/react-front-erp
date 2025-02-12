import type { Options, ResponseSWR, ListDataConfig } from 'src/core/types';
import type { ISave, ITreeModel, IFindByUuid, ITableQuery, IFindById } from 'src/types/core';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcherPost, defaultParams } from 'src/utils/axios';

import { isDefined } from '../utils/common-util';



const endpoints = {
  core: {
    findByUuid: '/api/core/findByUuid',
    findById: '/api/core/findById',
    getListDataValues: '/api/core/getListDataValues',
    getTableQuery: 'api/core/getTableQuery',
    getTableQueryByUuid: 'api/core/getTableQueryByUuid',
    getTableQueryById: 'api/core/getTableQueryById',
    getSeqTable: 'api/core/getSeqTable',
    save: 'api/core/save',
    isUnique: 'api/core/isUnique',
    canDelete: '/api/core/canDelete',
    getTreeModel: '/api/core/getTreeModel'
  },
};


// ----------------------------------------------------------------------

/**
 * Retorna el ResponseSWR de una llamada a un servicio POST
 */
export function useMemoizedSendPost(endpoint: string, param: object = {}, revalidate: boolean = true, addDefaultParams: boolean = true): ResponseSWR {

  const body = {
    ...param,
    ...(addDefaultParams ? defaultParams() : {})
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
 * Busca un registro de una tabla por su id
 * @param param
 * @param revalidate
 * @returns
 */
export function useFindById(param: IFindById, revalidate: boolean = true): ResponseSWR {
  const endpoint = endpoints.core.findById;
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

export const getListDataValues = async (param: ListDataConfig): Promise<Options[]> => {
  const endpoint = endpoints.core.getListDataValues;
  try {
    const result = await sendPost(endpoint, param);
    return result.data || [];
  } catch (error) {
    throw new Error(`Error en el servicio getListDataValues ${error}`);
  }
};

/**
 * Retorna la consulta de una tabla
 * @param param
 * @returns
 */
export function useGetTableQuery(param: ITableQuery, revalidate: boolean = true): ResponseSWR {
  const endpoint = endpoints.core.getTableQuery;
  return useMemoizedSendPost(endpoint, param, revalidate);
}

/**
 * Retorna la consulta por uuid de una tabla
 * @param param
 * @returns
 */
export function useGetTableQueryByUuid(param: IFindByUuid, revalidate: boolean = false): ResponseSWR {
  const endpoint = endpoints.core.getTableQueryByUuid;
  return useMemoizedSendPost(endpoint, param, revalidate);
}


export function useGetTableQueryById(param: IFindById, revalidate: boolean = false): ResponseSWR {
  const endpoint = endpoints.core.getTableQueryById;
  return useMemoizedSendPost(endpoint, param, revalidate);
}

/**
 * Retorna el modelo para el componente Tree
 * @param param
 * @returns
 */
export function useGetTreeModel(param: ITreeModel): ResponseSWR {
  const endpoint = endpoints.core.getTreeModel;
  return useMemoizedSendPost(endpoint, param, false);
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
  const [module, table] = tableName.split('_');
  if (numberRowsAdded > 0) {
    try {
      const param = {
        module,
        tableName: table,
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


export const isUnique = async (tableName: string, primaryKey: string, columns: { columnName: string, value: any }[], id: any = undefined): Promise<any> => {
  const endpoint = endpoints.core.isUnique;
  const [module, table] = tableName.split('_');
  try {
    const param: Record<string, any> = {
      module,
      tableName: table,
      primaryKey,
      columns
    };
    if (isDefined(id)) {
      param.id = `${id}`;
    }
    const resp = await sendPost(endpoint, param);
    return resp.data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }

}


export const canDelete = async (tableName: string, primaryKey: string, values: any[], validate: boolean = true): Promise<boolean> => {
  const endpoint = endpoints.core.canDelete;
  const [module, table] = tableName.split('_');
  try {
    const param = {
      module,
      tableName: table,
      primaryKey,
      values,
      validate
    }
    await sendPost(endpoint, param);
  } catch (error) {
    throw new Error(`Error en el servicio canDelete ${error}`);
  }
  return true;
}


