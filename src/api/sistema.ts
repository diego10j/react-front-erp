import { useGetListDataValues } from './core';

/**
 * Retorna lista Usuarios
 * @returns
 */
export function useListDataUsuarios() {
  return useGetListDataValues('inv_unidad', 'ide_inuni', 'nombre_inuni');
}

/**
 * Retorna lista Perfiles
 * @returns
 */
export function useListDataPerfiles() {
  return useGetListDataValues('sis_perfil', 'ide_perf', 'nom_perf');
}

