

import { ListDataConfig } from 'src/core/types';

import { ResponseSWR } from '../core/types/query';
import { getIdeEmpr } from "../services/core/serviceSistema";
import { useGetTableQuery, useGetListDataValues } from './core';


// ====================== ListData =========================

export const listDataUsuarios: ListDataConfig = { tableName: 'sis_usuario', primaryKey: 'ide_usua', columnLabel: 'nom_usua' };

/**
 * Retorna ListData Usuarios
 * @returns
 */
export function useListDataUsuarios(): ResponseSWR {
  return useGetListDataValues(listDataUsuarios);
}


export const listDataPerfiles: ListDataConfig = { tableName: 'sis_perfil', primaryKey: 'ide_perf', columnLabel: 'nom_perf' };

/**
 * Retorna ListData Perfiles
 * @returns
 */
export function useListDataPerfiles(): ResponseSWR {
  return useGetListDataValues(listDataPerfiles);
}


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
 * Retorna TableQuery de un Usuario determindado
 * @param {id} ide_usua
 * @param {string} columns opcional
 * @returns TableQuery
 */
export function useTableQueryUsuario(id: number, columns?: string): ResponseSWR {
  return useGetTableQuery('sis_usuario', 'ide_usua', columns, `ide_usua = ${id}`);
}




// ====================== TableQuery Config =========================


/**
 * Retorna TableQuery Sucursales
 * @param {string} columns opcional
 * @returns TableQuery
 */
export function useTableQuerySucursales(columns?: string) {
  return useGetTableQuery('sis_sucursal', 'ide_sucu', columns, `ide_empr = ${getIdeEmpr()}`);
}




