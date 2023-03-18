import { sendPost } from '../../core/services/serviceRequest';

/**
 * Llama al servicio consultarTabla
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} campoOrden
 * @param {Array} condiciones
 * @param {number} filas
 * @param {number} pagina
 * @returns
 */
export const consultarTabla = async (
  nombreTabla: string,
  campoPrimario: string,
  campoOrden: string,
  condiciones: any[],
  filas: number,
  pagina: number
) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoOrden = campoOrden.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    campoOrden,
    condiciones,
    filas,
    pagina
  };
  return sendPost('/api/sistema/consultarTabla', body);
};

export const consultarServicio = async (servicio: string, body: any = {}) => sendPost(servicio, body);

/**
 * Llama al servicio getColumnasTabla
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} ide_opci
 * @param {number} numero_tabl
 * @returns
 */
export const getColumnasTabla = async (nombreTabla: string, campoPrimario: string, ideOpci: string, numeTabla: number) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    ide_opci: ideOpci,
    numero_tabl: numeTabla
  };
  return sendPost('api/sistema/getColumnas', body);
};

/**
 * Llama al servicio getComboTabla
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} campoNombre
 * @param {string} condicion
 * @returns
 */
export const getComboTabla = async (nombreTabla: string, campoPrimario: string, campoNombre: string, condicion?: string) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  campoNombre = campoNombre.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    campoNombre,
    condicion
  };
  return sendPost('api/sistema/getCombo', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {any} valorCampoPrimario
 * @returns
 */
export const isEliminar = async (nombreTabla: string, campoPrimario: string, valorCampoPrimario: any) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    valorCampoPrimario
  };
  return sendPost('api/sistema/isEliminar', body);
};

/**
 *
 * @param {Array} listaSQL
 * @returns
 */
export const ejecutarListaSQL = async (listaSQL: string[]) => {
  const body = {
    listaSQL
  };
  return sendPost('api/sistema/ejecutarLista', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campo
 * @param {any} valorCampo
 * @returns
 */
export const isUnico = async (nombreTabla: string, campo: string, valorCampo: any) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campo = campo.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campo,
    valorCampo
  };
  return sendPost('api/sistema/isUnico', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {nummber} numeroFilas
 * @returns
 */
export const getMaximo = async (nombreTabla: string, campoPrimario: string, numeroFilas: number) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoPrimario,
    numeroFilas
  };
  return sendPost('api/sistema/getMaximo', body);
};

/**
 *
 * @param {string} nombreTabla
 * @param {string} campoPrimario
 * @param {string} campoNombre
 * @param {string} campoPadre
 * @param {string} campoOrden
 * @param {Array} condiciones
 * @returns
 */
export const consultarArbol = async (nombreTabla: string, campoPrimario: string, campoNombre: string, campoPadre: string, campoOrden: string, condiciones: string[]) => {
  nombreTabla = nombreTabla.toLowerCase(); // pg estandar para tablas
  campoPrimario = campoPrimario.toLowerCase(); // pg estandar para tablas
  campoNombre = campoNombre.toLowerCase(); // pg estandar para tablas
  campoOrden = campoOrden.toLowerCase(); // pg estandar para tablas
  const body = {
    nombreTabla,
    campoOrden,
    condiciones,
    campoPrimario,
    campoNombre,
    campoPadre
  };
  return sendPost('api/sistema/consultarArbol', body);
};

/**
 *
 * @param {string} ideOpci
 * @param {*} tabla
 * @param {Array} columnas
 * @returns
 */
export const configurarTabla = async (ideOpci: string, tabla: string, columnas: any[]) => {
  const body = {
    ide_opci: ideOpci,
    tabla,
    columnas
  };
  return sendPost('api/sistema/configurar', body);
};

/**
 *
 * @param {string} ideTabl
 * @returns
 */
export const eliminarConfiguracionTabla = async (ideTabl: string) => {
  const body = {
    ide_tabl: ideTabl
  };
  return sendPost('api/sistema/eliminarConfiguracion', body);
};

/**
 *
 * @param {string} ideOpci
 * @param {string} numeroTabla
 * @returns
 */
export const getConfiguracion = async (ideOpci: string, numeroTabla: string) => {
  const body = {
    ide_opci: ideOpci,
    numero_tabl: numeroTabla
  };
  return sendPost('api/sistema/getConfiguracion', body);
};

/**
 *
 * @param {string} longitud
 * @param {string} latitud
 * @returns
 */
export const getDatosClima = async (longitud: string, latitud: string) => {
  const body = {
    longitud,
    latitud
  };
  return sendPost('api/sistema/getDatosClima', body);
};

/**
 *
 * @returns
 */
export const importarParametros = async () => sendPost('api/sistema/importarParametros');
