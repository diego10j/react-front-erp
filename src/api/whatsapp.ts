import type { ResponseSWR } from "src/core/types";
import type { IGetUrl, IGetMensajes, IEnviarMensajes, ISetChatFavorito, ISetChatNoLeido, ISaveListasContacto, ISetEtiquetaChat, ISearchContacto } from "src/types/whatsapp";

import useSWR from "swr";
import { useMemo } from "react";

import axios, { fetcherPost } from "src/utils/axios";

import { CONFIG } from "src/config-global";

import { fileFormat } from "src/components/file-thumbnail";

import { getIdeEmpr, getVariableErp } from "./sistema";
import { sendPost, useGetTableQuery, useMemoizedSendPost } from './core';

const endpoints = {
  whatsapp: {
    getCuenta: '/api/whatsapp/getCuenta',
    getProfile: '/api/whatsapp/getProfile',
    getChats: '/api/whatsapp/getChats',
    getMensajes: '/api/whatsapp/getMensajes',
    enviarMensajeTexto: '/api/whatsapp/enviarMensajeTexto',
    setMensajesLeidosChat: '/api/whatsapp/enviarMensajeTexto',
    setChatNoLeido: '/api/whatsapp/setChatNoLeido',
    setEtiquetaChat: '/api/whatsapp/setEtiquetaChat',
    validarPermisoAgente: '/api/whatsapp/validarPermisoAgente',
    getListas: '/api/whatsapp/getListas',
    getEtiquetas: '/api/whatsapp/getEtiquetas',
    getTotalMensajes: '/api/whatsapp/getTotalMensajes',
    getContactosLista: '/api/whatsapp/getContactosLista',
    findContacto: '/api/whatsapp/findContacto',
    findTextoMensajes: '/api/whatsapp/findTextoMensajes',
    enviarMensajeMedia: '/api/whatsapp/enviarMensajeMedia',
    getUrlArchivo: '/api/whatsapp/getUrlArchivo',
    download: '/api/whatsapp/download',
    setChatFavorito: '/api/whatsapp/setChatFavorito',
    getListasContacto: '/api/whatsapp/getListasContacto',
    saveListasContacto: '/api/whatsapp/saveListasContacto',
    searchContacto: '/api/whatsapp/searchContacto',
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


export function useGetCuenta(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getCuenta;
  // return useMemoizedSendPost(endpoint, {}, false);
  return useMemoizedSendPost(endpoint, {});
}

export function useGetProfile(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getProfile;
  // return useMemoizedSendPost(endpoint, {}, false);
  return useMemoizedSendPost(endpoint, {});
}

export function useGetMensajes(param: IGetMensajes): ResponseSWR {
  const endpoint = endpoints.whatsapp.getMensajes;
  return useMemoizedSendPost(endpoint, param, {
    addDefaultParams: true,
    revalidateOptions: {
      onFocus: enableServer
    }
  });
  // return useMemoizedSendPost(endpoint, param, enableServer);
}

export const enviarMensajeTexto = async (param: IEnviarMensajes) => {
  const endpoint = endpoints.whatsapp.enviarMensajeTexto;
  return sendPost(endpoint, param);
};

export const setMensajesLeidosChat = async (param: IGetMensajes) => {
  const endpoint = endpoints.whatsapp.setMensajesLeidosChat;
  return sendPost(endpoint, param);
};

export const setChatNoLeido = async (param: ISetChatNoLeido) => {
  const endpoint = endpoints.whatsapp.setChatNoLeido;
  return sendPost(endpoint, param);
};

export const setChatFavorito = async (param: ISetChatFavorito) => {
  const endpoint = endpoints.whatsapp.setChatFavorito;
  return sendPost(endpoint, param);
};

export const setEtiquetaChat = async (param: ISetEtiquetaChat) => {
  const endpoint = endpoints.whatsapp.setEtiquetaChat;
  return sendPost(endpoint, param);
};

export const enviarMensajeMedia = async (file: File, telefono: string, caption?: string) => {
  const URL = endpoints.whatsapp.enviarMensajeMedia;
  const user = JSON.parse(localStorage.getItem('user') || '') || {};
  const formData = new FormData();
  formData.append('file', file);
  formData.append('login', user.login);
  formData.append('ideEmpr', (getVariableErp('empresa').ide_empr));
  formData.append('ideSucu', (getVariableErp('sucursal').ide_sucu));
  formData.append('ideUsua', user.ide_usua);
  formData.append('telefono', telefono);
  formData.append('fileName', file.name);
  formData.append('fileType', fileFormat(file.name));


  if (caption) {
    formData.append('caption', caption);
  }
  try {
    const { data } = await axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('Error uploading file', error);
    throw error;
  }
};


export function useValidarPermisoAgente(): ResponseSWR {
  const endpoint = endpoints.whatsapp.validarPermisoAgente;
  return useMemoizedSendPost(endpoint, {});
  // return useMemoizedSendPost(endpoint, {}, false);
}

export function useGetListas(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getListas;
  return useMemoizedSendPost(endpoint, {});
  // return useMemoizedSendPost(endpoint, {}, false);
}

export function useGetEtiquetas(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getEtiquetas;
  // return useMemoizedSendPost(endpoint, {}, false);
  return useMemoizedSendPost(endpoint, {});
}

export function useTotalMensajes(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getTotalMensajes;
  return useMemoizedSendPost(endpoint);
}

export function useGetContactosLista(): ResponseSWR {
  const endpoint = endpoints.whatsapp.getContactosLista;
  return useMemoizedSendPost(endpoint, {});
  // return useMemoizedSendPost(endpoint, {}, false);
}


export function useFindContacto(): ResponseSWR {
  const endpoint = endpoints.whatsapp.findContacto;
  // return useMemoizedSendPost(endpoint, {}, false);
  return useMemoizedSendPost(endpoint, {});
}


export function useFindTextoMensajes(): ResponseSWR {
  const endpoint = endpoints.whatsapp.findTextoMensajes;
  // return useMemoizedSendPost(endpoint, {}, false);
  return useMemoizedSendPost(endpoint, {});
}

export function useGetUrlArchivo(param: IGetUrl): ResponseSWR {
  const endpoint = endpoints.whatsapp.getUrlArchivo;
  // return useMemoizedSendPost(endpoint, param, false);
  return useMemoizedSendPost(endpoint, {});
}

/**
 * Retorna la URL de la imagen
 * @param nombreImagen
 * @returns
 */
export const getMediaFile = (id: string) => `${CONFIG.serverUrl}${endpoints.whatsapp.download}/${getIdeEmpr()}/${id}`;


export function useGetListasContacto(param: IGetMensajes): ResponseSWR {
  const endpoint = endpoints.whatsapp.getListasContacto;
  return useMemoizedSendPost(endpoint, {});
  // return useMemoizedSendPost(endpoint, param, false);
}


export const saveListasContacto = async (param: ISaveListasContacto) => {
  const endpoint = endpoints.whatsapp.saveListasContacto;
  return sendPost(endpoint, param);
};


export function useSearchContacto(param: ISearchContacto): ResponseSWR {
  const endpoint = endpoints.whatsapp.searchContacto;
  // return useMemoizedSendPost(endpoint, param, false);
  return useMemoizedSendPost(endpoint, {});
}


/**
 * Retorna TableQuery Listas de WhatsApp
 * @returns TableQuery
 */
export function useTableQueryListas() {
  const condition = `ide_empr = ${getIdeEmpr()}`;
  const param = {
    module: "wha",
    tableName: "lista",
    primaryKey: "ide_whlis",
    condition
  }
  return useGetTableQuery(param)
}
