import axios from '../../utils/axios';
/**
 *
 * @param {File} archivo
 * @returns
 */
export const subirFoto = async (archivo: File) => {
  try {
    const formData = new FormData();
    formData.append('imagen', archivo);
    const { data } = await axios.post('/api/uploads/subirImagen', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (data.nombreImagen) {
      return data.nombreImagen;
    }
  } catch (error) {
    throw error?.mensaje || 'Error al subir el archivo';
  }
  return undefined;
};
