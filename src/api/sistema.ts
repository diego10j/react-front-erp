import { STORAGE_KEY } from '../components/settings/config-settings';




// ====================== TableQuery =========================


// ====================== Funciones =========================

/**
 * Retorna el valor de una variable del Usuario
 * @param name
 * @returns
 */
export function getVariableUser(name?: string): any {
  const user = JSON.parse(localStorage.getItem('user') || '');
  if (user) {
    if (name && name in user) {
      return user[name];
    }
    return user;
  }
  return undefined;
}

/**
 * Retorna el valor de una variable sistema
 * @param name
 * @returns
 */
export function getVariableErp(name: string): any {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEY) || '');
  if (user) {
    if (name && name in user) {
      return user[name];
    }
  }
  return {};
}

export const getEmpresas = (): any[] => getVariableUser('empresas') || [];
export const getSucursales = (): any[] => getVariableUser('sucursales') || [];
export const getPerfiles = (): any[] => getVariableUser('perfiles') || [];
export const getIdeEmpr = (): number => Number(getVariableErp('empresa').ide_empr);
export const getIdeSucu = (): number => Number(getVariableErp('sucursal').ide_sucu);
export const getIdePerf = (): number => Number(getVariableErp('perfil').ide_perf);
export const getIdeUsua = (): number => Number(getVariableUser('ide_usua'));
export const getLogin = (): string => getVariableUser('login');
export const getNombreEmpresa = (): string => getVariableErp('empresa').nom_empr;
