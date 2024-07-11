import { useGetTableQuery } from "./core";



// ====================== OPCIONES =========================

/**
 * Retorna TableQuery Opciones
 * @param {string} columns opcional
 * @returns TableQuery
 */
export function useTableQueryOpciones(sis_ide_opci: string | null, columns?: string) {
  const whereClause = sis_ide_opci === null ? 'sis_ide_opci isnull' : `sis_ide_opci = ${sis_ide_opci}`;
  return useGetTableQuery('sis_opcion', 'ide_opci', columns, whereClause);
}


// ====================== TableQuery =========================


// ====================== Funciones =========================

/**
 * Retorna el valor de una variable sistema
 * @param name
 * @returns
 */
export function getVariable(name: string): any {
  const user = JSON.parse(sessionStorage.getItem('user') || '');
  if (user) {
    if (name in user) {
      return user[name];
    }
  }
  return undefined;
}

export const getIdeEmpr = (): number => Number(getVariable('ide_empr'));

export const getIdeSucu = (): number => Number(getVariable('ide_sucu'));

export const getIdeUsua = (): number => Number(getVariable('ide_usua'));

export const getLogin = (): string => getVariable('login');

export const getNombreEmpresa = (): string => getVariable('empresa');
