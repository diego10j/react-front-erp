import type { IgetFiles, IRenameFile, IDeleteFiles, ICreateFolder, IFavoriteFile } from 'src/types/file';

import { CONFIG } from 'src/config-global';

import axios from '../../utils/axios';
import { getIdeEmpr } from '../sistema';
import { sendPost, useMemoizedSendPost } from '../core';


// -------------------------------------------------------
const endpoints = {
  files: {
    getFiles: '/api/sistema/files/getFiles',
    createFolder: '/api/sistema/files/createFolder',
    uploadFile: '/api/sistema/files/uploadFile',
    deleteFiles: '/api/sistema/files/deleteFiles',
    renameFile: '/api/sistema/files/renameFile',
    favoriteFile: '/api/sistema/files/favoriteFile',
    uploadStaticImage: '/api/sistema/files/image',
    getStaticImage: '/api/sistema/files/image',
  },
};
// -------------------------------------------------------

export function useGetFiles(param: IgetFiles) {
  const endpoint = endpoints.files.getFiles;
  return useMemoizedSendPost(endpoint, param);
};

export const createFolder = async (param: ICreateFolder) => {
  const endpoint = endpoints.files.createFolder;
  return sendPost(endpoint, param);
};



export const uploadFile = async (file: File, sis_ide_arch?: number, ide_inarti?: number) => {
  const URL = endpoints.files.uploadFile;
  const user = JSON.parse(localStorage.getItem('user') || '') || {};
  const formData = new FormData();
  formData.append('file', file);
  formData.append('login', user.login);
  formData.append('ide_empr', `${getIdeEmpr()}`);

  if (sis_ide_arch)
    formData.append('sis_ide_arch', `${sis_ide_arch}`);
  if (ide_inarti)
    formData.append('ide_inarti', `${ide_inarti}`);
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

export const deleteFiles = async (param: IDeleteFiles) => {
  const endpoint = endpoints.files.deleteFiles;
  return sendPost(endpoint, param);
};


export const renameFile = async (param: IRenameFile) => {
  const endpoint = endpoints.files.renameFile;
  return sendPost(endpoint, param);
};

export const favoriteFile = async (param: IFavoriteFile) => {
  const endpoint = endpoints.files.favoriteFile;
  return sendPost(endpoint, param);
};


// ========================================================================

export const sendUploadImage = async (archivo: File) => {
  try {
    const URL = endpoints.files.uploadStaticImage;
    const formData = new FormData();
    formData.append('file', archivo);
    const { data } = await axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (data.filename) {  // url
      return data.filename;
    }
  } catch (error) {
    throw error?.mensaje || 'Error al subir el archivo';
  }
  return undefined;
};

/**
 * Retorna la URL de la imagen
 * @param nombreImagen
 * @returns
 */
export const getUrlImagen = (nombreImagen: string) => `${CONFIG.serverUrl}${endpoints.files.getStaticImage}/${nombreImagen}`;

/**
 * Retorna solo el nombre de la imagen
 * @param nombreImagen
 * @returns
 */
export const removeUrlImagen = (urlImagen: string) => urlImagen.replaceAll(`${CONFIG.serverUrl}${endpoints.files.getStaticImage}/`, '');
