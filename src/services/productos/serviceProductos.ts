
import { Query } from '../../core/types';

/**
 * Retorna el Query listado de Productos
 */
export const getQueryListProductos = (): Query => ({
    serviceName: '/api/productos/getProductos',
    params: {}
})