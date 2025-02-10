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

  const { data, isLoading, error, isValidating } = useSWR<any[]>(url, fetcherPost, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      contacts: data || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetChats_(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getChats;
  return useMemoizedSendPost(endpoint);
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
