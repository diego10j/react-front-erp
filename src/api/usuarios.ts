import { endpoints } from 'src/utils/axios';

import { ResponseSWR, ListDataConfig } from 'src/core/types';

import { useGetTableQuery, useMemoizedValue, useGetListDataValues } from './core';

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



// ====================== TableQuery =========================

/**
 * Retorna TableQuery de un Usuario determindado
 * @param {id} ide_usua
 * @param {string} columns opcional
 * @returns TableQuery
 */
export function useTableQueryUsuario(id: number, columns?: string): ResponseSWR {
  return useGetTableQuery('sis_usuario', 'ide_usua', columns, `ide_usua = ${id}`);
}


/**
 * Retorna el listado de productos
 * @returns
 */
export function useGetUsuarios() {
  const URL = endpoints.sistema.usuarios.getUsuarios;
  return useMemoizedValue(URL);
}
