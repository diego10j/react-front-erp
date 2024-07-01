import { getIdeEmpr } from './sistema';
import { useGetTableQuery, useGetListDataValues } from './core';

import type { ResponseSWR, ListDataConfig } from '../core/types';



// ====================== ListData =========================

export const listDataEmpresa: ListDataConfig = { tableName: 'sis_empresa', primaryKey: 'ide_empr', columnLabel: 'nom_empr' };

/**
 * Retorna ListData Empresas
 * @returns
 */
export function useListDataEmpresa(): ResponseSWR {
  return useGetListDataValues(listDataEmpresa);
}




// ====================== TableQuery =========================

/**
 * Retorna TableQuery Empresa
 * @param {string} columns opcional
 * @returns TableQuery
 */
export function useTableQueryEmpresa(columns?: string): ResponseSWR {
  return useGetTableQuery('sis_empresa', 'ide_empr', columns, `ide_empr = ${getIdeEmpr()}`);
}


/**
 * Retorna TableQuery Sucursales
 * @param {string} columns opcional
 * @returns TableQuery
 */
export function useTableQuerySucursales(columns?: string) {
  return useGetTableQuery('sis_sucursal', 'ide_sucu', columns, `ide_empr = ${getIdeEmpr()}`);
}



// ====================== Funciones =========================

export const getOptionsObligadoContabilidad = (): {
  label: string;
  value: string;
}[] => [
    { value: 'SI', label: 'Si' },
    { value: 'NO', label: 'No' }
  ]
