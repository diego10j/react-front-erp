


import { useMemoizedSendPost } from '../core';

import type { ResponseSWR } from '../../core/types';
import type { ITableQueryHorarios } from 'src/types/sistema/admin';

// ----------------------------------------------------------------------
const endpoints = {
  admin: {
    getListDataTiposHorario: '/api/sistema/admin/getListDataTiposHorario',
    getTableQueryTiposHorario: '/api/sistema/admin/getTableQueryTiposHorario',
    getTableQueryHorario: '/api/sistema/admin/getTableQueryHorario',
  }
};
// ----------------------------------------------------------------------
/**
 * Retorna ListData Tipos Horario
 * @returns
 */
export function useListDataTiposHorario(): ResponseSWR {
  const endpoint = endpoints.admin.getListDataTiposHorario;
  return useMemoizedSendPost(endpoint, {}, false);
}


/**
 * Retorna TableQuery Tipos Horario
 * @returns TableQuery
 */
export function useTableQueryTiposHorario(): ResponseSWR {
  const endpoint = endpoints.admin.getTableQueryTiposHorario;
  return useMemoizedSendPost(endpoint, {}, false);
}

/**
 * Retorna TableQuery Tipos Horario
 * @returns TableQuery
 */
export function useTableQueryHorario(params: ITableQueryHorarios): ResponseSWR {
  const endpoint = endpoints.admin.getTableQueryHorario;
  return useMemoizedSendPost(endpoint, params, false);
}
