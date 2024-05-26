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
    deleteFolder: '/api/files/delete-folder',
    moveItem: '/api/files/move'
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



export const uploadFile = async (file: File, sis_ide_arch?: number) => {
  const URL = endpoints.files.uploadFile;
  const user = JSON.parse(sessionStorage.getItem('user') || '') || {};
  const formData = new FormData();
  formData.append('file', file);
  formData.append('login', user.login);
  if (sis_ide_arch)
    formData.append('sis_ide_arch', `${sis_ide_arch}`);


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


export const renameItem = async (currentPath: string, newName: string) => {
  const URL = endpoints.files.renameFile;
  try {
    const { data } = await axios.put(URL, { currentPath, newName });
    return data;
  } catch (error) {
    console.error('Error renaming item', error);
    throw error;
  }
};

export const moveItem = async (sourcePath: string, destinationPath: string) => {
  const URL = endpoints.files.moveItem;
  try {
    const { data } = await axios.put(URL, { sourcePath, destinationPath });
    return data;
  } catch (error) {
    console.error('Error moving item', error);
    throw error;
  }
};
