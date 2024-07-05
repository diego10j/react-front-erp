import type { ResponseSWR, ListDataConfig } from 'src/core/types';

import { endpoints } from 'src/utils/axios';

import { useFindByUuid, useGetTableQuery, useMemoizedSendPost, useGetListDataValues } from './core';

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
export function useTableQueryUsuario(id: string, columns?: string): ResponseSWR {
  return useGetTableQuery('sis_usuario', 'ide_usua', columns, `uuid = '${id}'`);
}



export function useFindUsuario(id: string, revalidate: boolean = true, columns?: string): ResponseSWR {
  return useFindByUuid({
    tableName: 'sis_usuario',
    uuid: id,
    columns
  }
    , revalidate
  );
}

/**
 * Retorna el listado de productos
 * @returns
 */
export function useGetUsuarios() {
  const endpoint = endpoints.sistema.usuarios.getUsuarios;
  return useMemoizedSendPost(endpoint);
}
