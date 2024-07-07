import { CONFIG } from 'src/config-global';

import axios, { endpoints } from '../utils/axios';
/**
 *
 * @param {File} archivo
 * @returns
 */
export const sendUploadImage = async (archivo: File) => {
  try {
    const URL = endpoints.files.image;
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
export const getUrlImagen = (nombreImagen: string) => `${CONFIG.site.serverUrl}${endpoints.files.getImagen}/${nombreImagen}`;
