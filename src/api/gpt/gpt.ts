import { sendPost, useMemoizedSendPost } from '../core';

const endpoints = {
  gpt: {
    generateContentProduct: '/api/gpt/generateContentProduct',
  }
};

// ===============================================

/**
 * Genera contenido para la Publicación de un producto
 * @returns
 */

export const generateContentProduct = async (nombreProducto: string) => {
  const endpoint = endpoints.gpt.generateContentProduct;
  const param = {
    product: nombreProducto
  }
  return sendPost(endpoint, param);
};
