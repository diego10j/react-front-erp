import { TableQuery } from '../../core/types';

/**
 * Retorna TableQuery de los datos de la empresa
 * @param {string} columns opcional
 * @returns TableQuery
 */
export const getTableQueryEmpresa = (columns?: string): TableQuery => ({ tableName: 'sis_empresa', primaryKey: 'ide_empr', columns })