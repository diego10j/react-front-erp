import { ResponseSWR } from '../core/types/query';
import { getIdeEmpr } from "../services/core/serviceSistema";
import { useGetTableQuery, useGetListDataValues } from './core';


// ====================== DropDown ListData =========================

/**
 * Retorna ListData Usuarios
 * @returns
 */
export function useListDataUsuarios() {
  return useGetListDataValues('inv_unidad', 'ide_inuni', 'nombre_inuni');
}

/**
 * Retorna ListData Perfiles
 * @returns
 */
export function useListDataPerfiles() {
  return useGetListDataValues('sis_perfil', 'ide_perf', 'nom_perf');
}


/**
 * Retorna ListData Empresas
 * @returns
 */
export function useListDataEmpresa() {
  return useGetListDataValues('sis_empresa', 'ide_empr', 'nom_empr');
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
