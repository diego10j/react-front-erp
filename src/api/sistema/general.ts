import { useMemoizedSendPost } from '../core';
import { IideGeprov } from '../../types/sistema/general';

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
