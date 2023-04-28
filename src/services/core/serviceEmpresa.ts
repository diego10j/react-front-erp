import { getIdeEmpr } from './serviceSistema';
import { TableQuery, Options } from '../../core/types';

/**
 * Retorna TableQuery de los datos de la empresa
 * @param {string} columns opcional
 * @returns TableQuery
 */
export const getTableQueryEmpresa = (columns?: string): TableQuery => ({ tableName: 'sis_empresa', primaryKey: 'ide_empr', columns, where: `ide_empr = ${getIdeEmpr()}` })


export const getOptionsObligadoContabilidad = (): Options[] => [
    { value: 'SI', label: 'Si' },
    { value: 'NO', label: 'No' }
]