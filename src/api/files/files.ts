import axios from '../../utils/axios';


// -------------------------------------------------------
export const endpoints = {
  files: {
    listFiles: '/api/files/list-files',
    rootFiles: '/api/files/list-root',
    createFolder: '/api/files/create-folder',
    uploadFile: '/api/files/upload-file',
    deleteFile: '/api/files/delete-file',
    deleteFolder: '/api/files/delete-folder',
    renameItem: '/api/files/rename',
    moveItem: '/api/files/move'
  },
};
// -------------------------------------------------------

export const listFiles = async (currentFolder: string) => {
  let URL = endpoints.files.rootFiles;
  if (currentFolder) {
    URL = endpoints.files.listFiles;
  }
  try {
    const { data } = await axios.get(`${URL}${currentFolder ? `${currentFolder}` : ''}`);
    return data;
  } catch (error) {
    console.error('Error fetching files', error);
    throw error;
  }
};

export const createFolder = async (folderName: string) => {
  const URL = endpoints.files.createFolder;
  try {
    const { data } = await axios.post(URL, { folderName });
    return data;
  } catch (error) {
    console.error('Error creating folder', error);
    throw error;
  }
};

export const uploadFile = async (currentFolder: string, file: File) => {
  const URL = `${endpoints.files.uploadFile}/${currentFolder}`;
  const formData = new FormData();
  formData.append('file', file);

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

export const deleteFile = async (currentFolder: string, fileName: string) => {
  const URL = `${endpoints.files.deleteFile}/${currentFolder}/${fileName}`;
  try {
    const { data } = await axios.delete(URL);
    return data;
  } catch (error) {
    console.error('Error deleting file', error);
    throw error;
  }
};

export const deleteFolder = async (currentFolder: string, folderName: string) => {
  const URL = `${endpoints.files.deleteFolder}/${currentFolder}/${folderName}`;
  try {
    const { data } = await axios.delete(URL);
    return data;
  } catch (error) {
    console.error('Error deleting folder', error);
    throw error;
  }
};

export const renameItem = async (currentPath: string, newName: string) => {
  const URL = endpoints.files.renameItem;
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
