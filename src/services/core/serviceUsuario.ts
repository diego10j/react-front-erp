import { ListDataValues } from '../../core/types';

/**
 * Retorna Lista de Usuarios para DropDown 
 * @returns 
 */
export const getListDataUsuarios = (): ListDataValues => ({ tableName: 'sis_usuario', primaryKey: 'ide_usua', columnLabel: 'nom_usua' })