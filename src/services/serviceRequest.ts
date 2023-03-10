import axios from '../utils/axios';

/**
 * Llama mediate axios a un servicio post
 * @param {string} nombreServicio
 * @param {Array} param
 * @returns
 */
export const sendPost = async (nameService: string, param: any = {}): Promise<any> => {
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
export const sendGet = async (nameService: string, param: any = {}): Promise<any> => {
  const body = {
    ...param,
    ...getDefaultParams()
  };
  return axios.get(nameService, body);
};




function getDefaultParams() {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '') || [];
    return {
      ideEmpr: user.ide_empr,
      ideSucu: user.ide_sucu,
      ideUsua: user.ide_usua,
      idePerf: user.ide_perf,
      login: user.login,
      ip: localStorage.getItem('ip') || '127.0.0.1',
      device: localStorage.getItem('device') || 'PC'
    }
  }
  return {}
}


