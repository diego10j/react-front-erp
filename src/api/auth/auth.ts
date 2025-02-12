
import type { IGetMenuByRol, IValidarHorarioLogin } from 'src/types/auth';

import axiosInstance from 'src/utils/axios';

import { sendPost } from '../core';

const endpoints = {
  auth: {
    getMenuByRol: '/api/auth/getMenuByRol',
    validarHorarioLogin: '/api/auth/validarHorarioLogin',
  }
};


export function getMenuByRol(params: IGetMenuByRol) {
  const endpoint = endpoints.auth.getMenuByRol;
  return axiosInstance.post(endpoint, params);
}


export async function validarHorarioLogin(params: IValidarHorarioLogin) {
  const endpoint = endpoints.auth.validarHorarioLogin;
  return sendPost(endpoint, params);
}
