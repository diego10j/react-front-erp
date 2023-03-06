import axios from '../utils/axios';

/**
 * Llama mediate axios a un servicio post
 * @param {string} nombreServicio
 * @param {Array} param
 * @returns
 */
export const llamarServicioPost = async (nombreServicio: string, param: any = {}) => {
  const body = {
    ...param,
    ...defaultParams
  };
  return axios.post(nombreServicio, body);
};

/**
 * Llama mediate axios a un servicio get
 * @param {string} nombreServicio
 * @param {Array} param
 * @returns
 */
export const llamarServicioGet = async (nombreServicio: string, param: any = {}) => {
  const body = {
    ...param,
    ...defaultParams
  };
  return axios.get(nombreServicio, body);
};

const defaultParams = {
  ide_empr: localStorage.getItem('ide_empr') || null,
  ide_sucu: localStorage.getItem('ide_sucu') || null,
  ide_usua: localStorage.getItem('ide_usua') || null,
  login: localStorage.getItem('login') || null,
  ip: localStorage.getItem('ip') || '127.0.0.1',
  device: localStorage.getItem('device') || 'PC'
};
