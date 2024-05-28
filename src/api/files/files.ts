import { IgetFiles, IRenameFile, IDeleteFiles, ICreateFolder, IFavoriteFile } from 'src/types/file';

import axios from '../../utils/axios';
import { sendPost, useMemoizedSendPost } from '../core';


// -------------------------------------------------------
export const endpoints = {
  files: {
    getFiles: '/api/files/getFiles',
    createFolder: '/api/files/createFolder',
    uploadFile: '/api/files/uploadFile',
    deleteFiles: '/api/files/deleteFiles',
    renameFile: '/api/files/renameFile',
    favoriteFile: '/api/files/favoriteFile',
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
  const user = JSON.parse(sessionStorage.getItem('user') || '') || {};
  const formData = new FormData();
  formData.append('file', file);
  formData.append('login', user.login);
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

