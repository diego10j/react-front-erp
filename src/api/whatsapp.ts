import type { ResponseSWR } from "src/core/types";
import type { IGetMensajes, IEnviarMensajes } from "src/types/whatsapp";

import useSWR from "swr";
import { useMemo } from "react";

import { fetcherPost } from "src/utils/axios";

import { sendPost, useMemoizedSendPost } from './core';

const endpoints = {
  whatsapp: {
    getProfile: '/api/whatsapp/getProfile',
    getChats: '/api/whatsapp/getChats',
    getMensajes: '/api/whatsapp/getMensajes',
    enviarMensajeTexto: '/api/whatsapp/enviarMensajeTexto',
    setMensajesLeidosChat: '/api/whatsapp/enviarMensajeTexto',
    setChatNoLeido: '/api/whatsapp/setChatNoLeido',
  }
};

// ----------------------------------------------------------------------

const enableServer = false;


const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

export function useGetChats() {
  const url = endpoints.whatsapp.getChats;

  const { data, isLoading, error, isValidating, mutate } = useSWR<any[]>(url, fetcherPost, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      contacts: data || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.length,
      mutate
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}


export function useGetProfile(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getProfile;
  return useMemoizedSendPost(endpoint, {}, false);
}

export function useGetMensajes(param: IGetMensajes): ResponseSWR {
  const endpoint = endpoints.whatsapp.getMensajes;
  return useMemoizedSendPost(endpoint, param, enableServer);
}

export const enviarMensajeTexto = async (param: IEnviarMensajes) => {
  const endpoint = endpoints.whatsapp.enviarMensajeTexto;
  return sendPost(endpoint, param);
};

export const setMensajesLeidosChat = async (param: IGetMensajes) => {
  const endpoint = endpoints.whatsapp.setMensajesLeidosChat;
  return sendPost(endpoint, param);
};

export const setChatNoLeido = async (param: IGetMensajes) => {
  const endpoint = endpoints.whatsapp.setChatNoLeido;
  return sendPost(endpoint, param);
};