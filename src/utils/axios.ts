import axios, { AxiosRequestConfig } from 'axios';

// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
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

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
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
  //
  sistema: {
    usuarios: {
      getUsuarios: '/api/usuarios/getUsuarios',
    }
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
  files: {
    image: '/api/files/image'
  },
  productos: {
    getProductos: '/api/productos/getProductos',
    getTrnProducto: '/api/productos/getTrnProducto',
    getSaldo: '/api/productos/getSaldo',
    getUltimosPreciosCompras: '/api/productos/getUltimosPreciosCompras',
    getComprasMensuales: '/api/productos/getComprasMensuales',
    getVentasMensuales: '/api/productos/getVentasMensuales',
  },
};


export const defaultParams = (): {} => {
  if (sessionStorage.getItem('user')) {
    const user = JSON.parse(sessionStorage.getItem('user') || '') || {};
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
