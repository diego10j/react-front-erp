
import { useMemoizedSendPost, sendPost } from '../core';

const endpoints = {
  auth: {
    getMenuByRol: '/api/auth/getMenuByRol',
  }
};


export function useGetMenuByRol() {
  const endpoint = endpoints.auth.getMenuByRol;
  return useMemoizedSendPost(endpoint, {}, false);
}
export const getMenuByRol = async () => {
  const endpoint = endpoints.auth.getMenuByRol;
  return sendPost(endpoint);
};
