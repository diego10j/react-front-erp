import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  let body = {
    ...defaultParams()
  };
  if (config?.params) {
    body = {
      ...config.params,
      ...defaultParams()
    };
  }
  const res = await axiosInstance.post(url, { ...body });

  return res.data;
};

// ----------------------------------------------------------------------

export const defaultParams = (): {} => {
  if (localStorage.getItem('user')) {
    const user = JSON.parse(localStorage.getItem('user') || '') || {};
    return {
      ideEmpr: user.ide_empr,
      ideSucu: user.ide_sucu,
      ideUsua: user.ide_usua,
      idePerf: user.ide_perf,
      login: user.login,
      ip: user.ip || '127.0.0.1',
      device: user.device
    }
  }
  return {}
}

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  auth: {
    me: '/api/auth/check-status',
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },

  core: {
    findByUuid: '/api/core/findByUuid',
    getListDataValues: '/api/core/getListDataValues',
    getTableQuery: 'api/core/getTableQuery',
    getSeqTable: 'api/core/getSeqTable',
    save: 'api/core/save'
  },
  audit: {
    deleteEventosAuditoria: 'api/audit/deleteEventosAuditoria',
    getQueryEventosAuditoria: 'api/audit/getQueryEventosAuditoria',
  },
};
