
import { useMemoizedSendPost } from '../core';

import type { ResponseSWR, ListDataConfig } from '../../core/types';

const endpoints = {
  admin: {
    getListDataEmpresa: '/api/sistema/admin/getListDataEmpresa',
    getTableQueryEmpresa: '/api/sistema/admin/getTableQueryEmpresa',
    getListDataSucursal: '/api/sistema/admin/getListDataSucursal',
    getTableQuerySucursal: '/api/sistema/admin/getTableQuerySucursal',
  }
};




// ====================== ListData =========================

export const listDataEmpresa: ListDataConfig = { tableName: 'sis_empresa', primaryKey: 'ide_empr', columnLabel: 'nom_empr' };


// ==========================================================
/**
 * Retorna ListData Empresas
 * @returns
 */
export function useListDataEmpresa(): ResponseSWR {
  const endpoint = endpoints.admin.getListDataEmpresa;
  return useMemoizedSendPost(endpoint, {}, false);
}


/**
 * Retorna TableQuery Empresa
 * @returns TableQuery
 */
export function useTableQueryEmpresa(): ResponseSWR {
  const endpoint = endpoints.admin.getTableQueryEmpresa;
  return useMemoizedSendPost(endpoint, {}, false);
}


/**
 * Retorna ListData Sucursal
 * @returns
 */
export function useListDataSucursal(): ResponseSWR {
  const endpoint = endpoints.admin.getTableQuerySucursal;
  return useMemoizedSendPost(endpoint, {}, false);
}


/**
 * Retorna TableQuery Sucursales
 * @returns TableQuery
 */
export function useTableQuerySucursales() {
  const endpoint = endpoints.admin.getTableQuerySucursal;
  return useMemoizedSendPost(endpoint, {}, false);
}



// ====================== Funciones =========================

export const getOptionsObligadoContabilidad = (): {
  label: string;
  value: string;
}[] => [
    { value: 'SI', label: 'Si' },
    { value: 'NO', label: 'No' }
  ]
