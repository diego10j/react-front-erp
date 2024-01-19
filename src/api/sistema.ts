import { ResponseSWR, ListDataConfig } from 'src/core/types';

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





// ====================== Funciones =========================

/**
 * Retorna el valor de una variable sistema
 * @param name
 * @returns
 */
export function getVariable(name: string): any {
  const user = JSON.parse(sessionStorage.getItem('user') || '');
  if (user) {
    if (name in user) {
      return user[name];
    }
  }
  return undefined;
}

export const getIdeEmpr = (): number => Number(getVariable('ide_empr'));

export const getIdeSucu = (): number => Number(getVariable('ide_sucu'));

export const getIdeUsua = (): number => Number(getVariable('ide_usua'));

export const getLogin = (): string => getVariable('login');

export const getNombreEmpresa = (): string => getVariable('empresa');
