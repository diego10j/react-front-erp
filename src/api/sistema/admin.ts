
import { useMemoizedSendPost } from '../core';

import type { ResponseSWR } from '../../core/types';
import type { ITreeModelOpcion, ITableQueryPerfil, ITableQueryOpciones } from '../../types/admin';

// ----------------------------------------------------------------------
const endpoints = {
  admin: {
    getListDataSistema: '/api/sistema/admin/getListDataSistema',
    getTableQuerySistema: '/api/sistema/admin/getTableQuerySistema',
    getTableQueryOpcion: '/api/sistema/admin/getTableQueryOpcion',
    getTreeModelOpcion: '/api/sistema/admin/getTreeModelOpcion',
    getTableQueryPerfil: '/api/sistema/admin/getTableQueryPerfil',
    getPerfilesSistema: '/api/sistema/admin/getPerfilesSistema',
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


/**
 * Retorna TableQuery Perfiles
 * @returns TableQuery
 */
export function useTableQueryPerfil(param: ITableQueryPerfil): ResponseSWR {
  const endpoint = endpoints.admin.getTableQueryPerfil;
  return useMemoizedSendPost(endpoint, param, false);
}



/**
 * Retorna ListData Perfiles
 * @returns
 */
export function useGetPerfilesSistema(param: ITableQueryPerfil): ResponseSWR {
  const endpoint = endpoints.admin.getPerfilesSistema;
  return useMemoizedSendPost(endpoint, param);
}
