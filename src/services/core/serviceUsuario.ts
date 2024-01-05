import { TableQuery } from '../../core/types';



/**
 * Retorna TableQuery de los datos de la empresa
 * @param {string} columns opcional
 * @returns TableQuery
 */
export const getTableQueryUsuario = (id: number, columns?: string): TableQuery => ({ tableName: 'sis_usuario', primaryKey: 'ide_usua', columns, where: `ide_usua = ${id}` })


