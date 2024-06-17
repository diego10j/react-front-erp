
import { useMemoizedSendPost } from '../core';

const endpoints = {
  auth: {
    getMenuByRol: '/api/auth/getMenuByRol',
  }
};


export function useGetMenuByRol() {
  const endpoint = endpoints.auth.getMenuByRol;
  return useMemoizedSendPost(endpoint, {}, false);
}
