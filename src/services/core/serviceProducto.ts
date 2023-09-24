
import { ListDataValues } from '../../core/types/listDataValues';

/**
 * Retorna Lista de Categorias para DropDown
 * @returns 
 */
export const getListCategoria = (): ListDataValues => ({ tableName: 'inv_categoria', primaryKey: 'ide_incate', columnLabel: 'nombre_incate' })

/**
 * Retorna Lista de Unidades de medida para DropDown
 * @returns 
 */
export const getListUnidadesM = (): ListDataValues => ({ tableName: 'inv_unidad', primaryKey: 'ide_inuni', columnLabel: 'nombre_inuni' })

/**
 * Retorna Lista de Areas de aplicacion para DropDown
 * @returns 
 */
export const getListAreaAplica = (): ListDataValues => ({ tableName: 'inv_area', primaryKey: 'ide_inare', columnLabel: 'nombre_inare' })