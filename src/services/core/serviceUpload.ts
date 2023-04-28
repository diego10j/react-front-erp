import axios from '../../utils/axios';
/**
 *
 * @param {File} archivo
 * @returns
 */
export const sendUploadImage = async (archivo: File) => {
  try {
    const formData = new FormData();
    formData.append('file', archivo);
    const { data } = await axios.post('/api/files/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (data.url) {
      return data.url;
    }
  } catch (error) {
    throw error?.mensaje || 'Error al subir el archivo';
  }
  return undefined;
};
