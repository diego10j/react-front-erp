import axios from '../utils/axios';

/**
 * Llama mediate axios a un servicio post
 * @param {string} nombreServicio
 * @param {Array} param
 * @returns
 */
export const sendPost = async (nameService: string, param: any = {}) => {
  const body = {
    ...param,
    ...getDefaultParams()
  };
  return axios.post(nameService, body);
};

/**
 * Llama mediate axios a un servicio get
 * @param {string} nombreServicio
 * @param {Array} param
 * @returns
 */
export const sendGet = async (nameService: string, param: any = {}) => {
  const body = {
    ...param,
    ...getDefaultParams()
  };
  return axios.get(nameService, body);
};




function getDefaultParams() {
  const user: any = localStorage.getItem('user') || null;
  console.log(user);
  if (user) {
    return {
      ide_empr: user.ide_empr,
      ide_sucu: user.ide_sucu,
      ide_usua: user.ide_usua,
      login: user.login,
      ip: localStorage.getItem('ip') || '127.0.0.1',
      device: localStorage.getItem('device') || 'PC'
    }
  }
  return {}
}


