import { useMemoizedSendPost } from '../core';

const endpoints = {
  general: {
    getListDataPeriodos: '/api/general/getListDataPeriodos'
  },
};


// ====================== ListData =========================

/**
 * Retorna la lista de periodos para un Dropdown/Autocomplete
 * @returns
 */
export function useGetListDataPeriodos() {
  const endpoint = endpoints.general.getListDataPeriodos;
  return useMemoizedSendPost(endpoint, {}, false);
}
