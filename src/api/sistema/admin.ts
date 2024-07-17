
import type { ResponseSWR, ListDataConfig } from '../../core/types';
import { ITableQueryOpciones, ITreeModelOpcion } from '../../types/admin';
import { useMemoizedSendPost } from '../core';

// ----------------------------------------------------------------------
const endpoints = {
  admin: {
    getListDataSistema: '/api/sistema/admin/getListDataSistema',
    getTableQuerySistema: '/api/sistema/admin/getTableQuerySistema',
    getTableQueryOpcion: '/api/sistema/admin/getTableQueryOpcion',
    getTreeModelOpcion: '/api/sistema/admin/getTreeModelOpcion',
  }
};
// ----------------------------------------------------------------------
/**
 * Retorna ListData Sistema
 * @returns
 */
export function useListDataSistema(): ResponseSWR {
  const endpoint = endpoints.admin.getListDataSistema;
  return useMemoizedSendPost(endpoint, {}, false);
}

/**
 * Retorna TableQuery Sistema
 * @returns TableQuery
 */
export function useTableQuerySistema(): ResponseSWR {
  const endpoint = endpoints.admin.getTableQuerySistema;
  return useMemoizedSendPost(endpoint, {}, false);
}

/**
 * Retorna TableQuery Opcion
 * @returns TableQuery
 */
export function useTableQueryOpcion(param: ITableQueryOpciones): ResponseSWR {
  const endpoint = endpoints.admin.getTableQueryOpcion;
  return useMemoizedSendPost(endpoint, param, false);
}

/**
 * Retorna TreeModel Opcion
 * @returns TableQuery
 */
export function useTreeModelOpcion(param: ITreeModelOpcion): ResponseSWR {
  const endpoint = endpoints.admin.getTreeModelOpcion;
  return useMemoizedSendPost(endpoint, param);
}
