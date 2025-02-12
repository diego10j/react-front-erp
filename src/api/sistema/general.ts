import type { ListDataConfig } from 'src/core/types';

import { useMemoizedSendPost, useGetListDataValues } from '../core';

import type { IideGeprov } from '../../types/sistema/general';

const endpoints = {
  general: {
    getListDataPeriodos: 'api/sistema/general/getListDataPeriodos',
    getListDataProvincias: 'api/sistema/general/getListDataProvincias',
    getListDataCantones: 'api/sistema/general/getListDataCantones',
    getListDataTitulosPersona: 'api/sistema/general/getListDataTitulosPersona',
  },
};


// ====================== ListData =========================

/**
 * Retorna la lista de periodos
 * @returns
 */
export function useGetListDataPeriodos() {
  const endpoint = endpoints.general.getListDataPeriodos;
  return useMemoizedSendPost(endpoint, {}, false);
}

/**
 * Retorna la lista de Pprovincias
 * @returns
 */
export function useGetListDataProvincias() {
  const endpoint = endpoints.general.getListDataProvincias;
  return useMemoizedSendPost(endpoint, {}, false);
}

/**
 * Retorna la lista de cantones
 * @param param
 * @returns
 */
export function useGetListDataCantones(param: IideGeprov) {
  const endpoint = endpoints.general.getListDataCantones;
  return useMemoizedSendPost(endpoint, param, false);
}

/**
 * Retorna la lista de titulos de personas
 * @returns
 */
export function useGetListDataTitulosPersona() {
  const endpoint = endpoints.general.getListDataTitulosPersona;
  return useMemoizedSendPost(endpoint, {}, false);
}



/**
* Retorna lista de tipo identificacion
* @returns
*/
export function useGetListDataTipoIdentificacion() {
  const listDataVendedor: ListDataConfig = { module: 'gen', tableName: 'tipo_identifi', primaryKey: 'ide_getid', columnLabel: 'nombre_getid' };
  return useGetListDataValues(listDataVendedor);
}

export function useGetListDataGenero() {
  const listDataVendedor: ListDataConfig = { module: 'gen', tableName: 'genero', primaryKey: 'ide_gegen', columnLabel: 'nombre_gegen' };
  return useGetListDataValues(listDataVendedor);
}

export function useGetListDataEstadoCivil() {
  const listDataVendedor: ListDataConfig = { module: 'gen', tableName: 'estado_civil', primaryKey: 'ide_geeci', columnLabel: 'nombre_geeci' };
  return useGetListDataValues(listDataVendedor);
}

export function useGetListDataTituloPersona() {
  const listDataVendedor: ListDataConfig = { module: 'gen', tableName: 'titulo_persona', primaryKey: 'ide_getitp', columnLabel: 'nombre_getitp' };
  return useGetListDataValues(listDataVendedor);
}

export function useGetListDataTipoPersona() {
  const listDataVendedor: ListDataConfig = { module: 'gen', tableName: 'tipo_persona', primaryKey: 'ide_getip', columnLabel: 'nombre_getip' };
  return useGetListDataValues(listDataVendedor);
}

export function useGetListDataTipoDireccion() {
  const condition = `activo_getidi = true`;
  const listData: ListDataConfig = { module: 'gen', tableName: 'tipo_direccion', primaryKey: 'ide_getidi', columnLabel: 'nombre_getidi', condition };
  return useGetListDataValues(listData);
}
