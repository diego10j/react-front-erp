import type { Options, ResponseSWR, ListDataConfig } from 'src/core/types';
import type { MutateOptions, MutateFunction } from 'src/core/types/responseSWR';
import type { ISave, IFindById, ITreeModel, IFindByUuid, ITableQuery } from 'src/types/core';

import useSWR from 'swr';
import { useMemo, useState, useCallback } from 'react';

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

// Para Datos Críticos (ej: dashboard financiero)
// {
//   revalidateIfStale: true,
//   revalidateOnFocus: true,  // Máxima actualización
//   revalidateOnReconnect: true,
//   keepPreviousData: false,  // Prefiere vacío sobre datos obsoletos
//   dedupingInterval: 3000,
//   focusThrottleInterval: 5000
// }

// Para Datos Estáticos (ej: catálogo de productos)
// {
//   revalidateIfStale: false, // Confía en la caché
//   revalidateOnFocus: false, // No molestar al usuario
//   revalidateOnReconnect: true, // Pero actualizar si estuvo offline
//   keepPreviousData: true,
//   dedupingInterval: 10000
// }

// Para Tablas/Paginación *
// {
//   revalidateIfStale: true,
//   revalidateOnFocus: false,  // Evitar recargas al cambiar de pestaña
//   revalidateOnReconnect: true,
//   keepPreviousData: true,    // Mantener datos durante navegación
//   dedupingInterval: 5000,   // Proteger contra clicks rápidos
//   focusThrottleInterval: 30000 // Si eventualmente usas revalidateOnFocus
// }

/**
 * Retorna el ResponseSWR de una llamada a un servicio POST
 */
export function useMemoizedSendPost<T = any>(
  endpoint: string,
  initialParams: object = {},
  {
    addDefaultParams = true,
    revalidateOptions = {
      onFocus: false,
      onReconnect: true
    }
  }: {
    addDefaultParams?: boolean;
    revalidateOptions?: {
      onFocus?: boolean;
      onReconnect?: boolean;
    };
  } = {}
): ResponseSWR {
  // Estado de parámetros con tipo genérico
  const [params, setParams] = useState<Record<string, any>>(() => ({
    ...initialParams,
    ...(addDefaultParams ? defaultParams() : {})
  }));

  // Configuración optimizada de SWR
  const options = {
    revalidateIfStale: true, // Revalidar automáticamente cuando los datos están "stale" (obsoletos)
    revalidateOnFocus: revalidateOptions.onFocus, // Evitar recargas al cambiar de pestaña
    revalidateOnReconnect: revalidateOptions.onReconnect, // Revalidar cuando se recupera conexión a internet
    keepPreviousData: true, // Mantener datos durante navegación
    dedupingInterval: 5000, // Proteger contra clicks rápidos
    focusThrottleInterval: 10000 // Si eventualmente usas revalidateOnFocus
  };

  const { data, isLoading, error, isValidating, mutate: swrMutate } = useSWR(
    [endpoint, { params }],
    fetcherPost,
    options
  );

  // Mutate mejor tipado y con manejo de errores
  const mutate = useCallback<MutateFunction>(
    async (arg1?: any, arg2?: any) => {
      try {
        // Caso: Actualización con función
        if (typeof arg1 === 'function') {
          return await swrMutate(arg1, {
            revalidate: arg2 !== false,
            rollbackOnError: true
          });
        }

        // Caso: Nuevos parámetros
        if (arg1 && typeof arg1 === 'object') {
          const updatedParams = { ...params, ...arg1 };
          setParams(updatedParams);
          return await swrMutate(
            { params: updatedParams },
            typeof arg2 === 'boolean'
              ? { revalidate: arg2 }
              : arg2 || { revalidate: true }
          );
        }

        // Caso: Revalidación simple
        return await swrMutate();
      } catch (err) {
        console.error('Mutation error:', err);
        throw err;
      }
    },
    [params, swrMutate]
  );

  // updateParams con manejo más robusto
  const updateParams = useCallback(
    async (
      newParams?: Record<string, any>,
      mutateOptions: MutateOptions = { revalidate: true }
    ) => {
      const updatedParams = newParams ? { ...params, ...newParams } : params;
      setParams(updatedParams);
      return mutate({ params: updatedParams }, mutateOptions);
    },
    [mutate, params]
  );

  // Memoización selectiva para mejor rendimiento
  const memoizedValue = useMemo(() => ({
    dataResponse: data || [],
    isLoading,
    error,
    isValidating,
    mutate,
    currentParams: params,
    updateParams
  }), [data, error, isLoading, isValidating, mutate, params, updateParams]);

  return memoizedValue;
}


// ----------------------------------------------------------------------

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
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: revalidate
    }
  });
}

/**
 * Busca un registro de una tabla por su id
 * @param param
 * @param revalidate
 * @returns
 */
export function useFindById(param: IFindById, revalidate: boolean = true): ResponseSWR {
  const endpoint = endpoints.core.findById;
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: revalidate
    }
  });
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
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: revalidate
    }
  });
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
export function useGetTableQuery(param: ITableQuery, revalidate: boolean = false): ResponseSWR {
  const endpoint = endpoints.core.getTableQuery;
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: revalidate
    }
  });
}

/**
 * Retorna la consulta por uuid de una tabla
 * @param param
 * @returns
 */
export function useGetTableQueryByUuid(param: IFindByUuid, revalidate: boolean = false): ResponseSWR {
  const endpoint = endpoints.core.getTableQueryByUuid;
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: revalidate
    }
  });
}


export function useGetTableQueryById(param: IFindById, revalidate: boolean = false): ResponseSWR {
  const endpoint = endpoints.core.getTableQueryById;
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: revalidate
    }
  });
}

/**
 * Retorna el modelo para el componente Tree
 * @param param
 * @returns
 */
export function useGetTreeModel(param: ITreeModel): ResponseSWR {
  const endpoint = endpoints.core.getTreeModel;
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: false
  });
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
