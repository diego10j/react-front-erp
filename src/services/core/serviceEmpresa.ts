import { getIdeEmpr } from './serviceSistema';
import { Options, TableQuery } from '../../core/types';


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


export const getTableQuerySucursal = (ide_sucu: string, columns?: string): TableQuery => ({ tableName: 'sis_sucursal', primaryKey: 'ide_sucu', columns, where: `ide_sucu = ${ide_sucu}` })

