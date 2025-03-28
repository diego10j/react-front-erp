import type { ResponseSWR, ListDataConfig } from 'src/core/types';

import { useMemoizedSendPost, useGetListDataValues } from '../core';

const endpoints = {
  usuarios: {
    getUsuarios: '/api/sistema/usuarios/getUsuarios',
    getTableQueryUsuarioByUuid: '/api/sistema/usuarios/getTableQueryUsuarioByUuid',
    getListDataUsuario: '/api/sistema/usuarios/getListDataUsuario',
  }
};



// ====================== ListData =========================

export const listDataUsuarios: ListDataConfig = { module: 'sis', tableName: 'usuario', primaryKey: 'ide_usua', columnLabel: 'nom_usua' };
export const listDataPerfiles: ListDataConfig = { module: 'sis', tableName: 'perfil', primaryKey: 'ide_perf', columnLabel: 'nom_perf' };

/**
 * Retorna ListData Usuarios
 * @returns
 */
export function useListDataUsuario(): ResponseSWR {
  const endpoint = endpoints.usuarios.getUsuarios;
  return useMemoizedSendPost(endpoint, {}, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: false,
      onReconnect: true
    }
  });
}



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
 * @param {uuid} id usuario
 * @returns TableQuery
 */
export function useGetTableQueryUsuarioByUuid(uuid?: string): ResponseSWR {

  const endpoint = endpoints.usuarios.getTableQueryUsuarioByUuid;
  const param = { uuid }
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: false,
      onReconnect: true
    }
  });
}

/**
 * Retorna el listado de productos
 * @returns
 */
export function useGetUsuarios() {
  const endpoint = endpoints.usuarios.getUsuarios;
  return useMemoizedSendPost(endpoint);
}
