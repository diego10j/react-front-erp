import { TableQuery, ListDataValues } from '../../core/types';

/**
 * Retorna Lista de Usuarios para DropDown
 * @returns
 */
export const getListDataUsuarios = (): ListDataValues => ({ tableName: 'sis_usuario', primaryKey: 'ide_usua', columnLabel: 'nom_usua' })

/**
 * Retorna TableQuery de los datos de la empresa
 * @param {string} columns opcional
 * @returns TableQuery
 */
export const getTableQueryUsuario = (id: number, columns?: string): TableQuery => ({ tableName: 'sis_usuario', primaryKey: 'ide_usua', columns, where: `ide_usua = ${id}` })



// ----------------------------------------------------------------------
// PERFILES
// ----------------------------------------------------------------------

export const getListDataPerfiles = (): ListDataValues => ({ tableName: 'sis_perfil', primaryKey: 'ide_perf', columnLabel: 'nom_perf' })
