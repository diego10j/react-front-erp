
import type { IUuid } from 'src/types/core';
import type { ListDataConfig } from 'src/core/types'; import type { IgetTrnCliente, IgetSaldoCliente, IgetProductosCliente } from 'src/types/ventas/clientes';

import { getIdeEmpr } from '../sistema';
import { useMemoizedSendPost, useGetListDataValues, useGetTableQueryById, useGetTableQueryByUuid } from '../core';

const endpoints = {
  clientes: {
    getClientes: '/api/ventas/clientes/getClientes',
    getSaldosClientes: '/api/ventas/clientes/getSaldosClientes',
    getCliente: '/api/ventas/clientes/getCliente',
    getSaldo: '/api/ventas/clientes/getSaldo',
    getTrnCliente: '/api/ventas/clientes/getTrnCliente',
    getDetalleVentasCliente: '/api/ventas/clientes/getDetalleVentasCliente',
    getProductosCliente: '/api/ventas/clientes/getProductosCliente',
    getVentasMensuales: '/api/ventas/clientes/getVentasMensuales',
    getVentasConUtilidad: '/api/ventas/clientes/getVentasConUtilidad',
    getDireccionesCliente: '/api/ventas/clientes/getDireccionesCliente',
    getContactosCliente: '/api/ventas/clientes/getContactosCliente',
  }
};

// ====================== ListData =========================

export function useGetListDataVendedores() {
  const condition = `ide_empr = ${getIdeEmpr()}`;
  const listData: ListDataConfig = { module: 'ven', tableName: 'vendedor', primaryKey: 'ide_vgven', columnLabel: 'nombre_vgven', condition };
  return useGetListDataValues(listData);
}

export function useGetListDataTipoContribuyente() {
  const listData: ListDataConfig = { module: 'con', tableName: 'tipo_contribu', primaryKey: 'ide_cntco', columnLabel: 'nombre_cntco', condition: 'activo_cntco = true' };
  return useGetListDataValues(listData);
}

export function useGetListDataFormasPagoCliente() {
  const listData: ListDataConfig = { module: 'con', tableName: 'deta_forma_pago', primaryKey: 'ide_cndfp', columnLabel: 'nombre_cndfp', condition: 'ide_cncfp = 1' };
  return useGetListDataValues(listData);
}


// ===============================================

export function useGetTableQueryClienteByUuid(uuid?: string) {
  const param = {
    module: 'gen',
    tableName: 'persona',
    primaryKey: 'ide_geper',
    uuid
  };
  return useGetTableQueryByUuid(param,)
}


/**
 * Retorna Listado de Clientes
 * @returns TableQuery
 */
export function useGetClientes() {
  const endpoint = endpoints.clientes.getClientes;
  return useMemoizedSendPost(endpoint);
}

/**
 * Retorna Listado de Clientes con saldo diferente a 0
 * @returns TableQuery
 */
export function useGetSaldosClientess() {
  const endpoint = endpoints.clientes.getSaldosClientes;
  return useMemoizedSendPost(endpoint);
}

/**
 * Busca un cliente po uuid
 * @param param
 * @returns
 */
export function useGetCliente(param: IUuid) {
  const endpoint = endpoints.clientes.getCliente;
  return useMemoizedSendPost(endpoint, param);
}


export function useGetTrnCliente(param: IgetTrnCliente) {
  const endpoint = endpoints.clientes.getTrnCliente;
  return useMemoizedSendPost(endpoint, param);
}

export function useGetSaloCliente(param: IgetSaldoCliente) {
  const endpoint = endpoints.clientes.getSaldo;
  return useMemoizedSendPost(endpoint, param);
}

export function useGetVentasConUtilidad(param: IgetTrnCliente) {
  const endpoint = endpoints.clientes.getVentasConUtilidad;
  return useMemoizedSendPost(endpoint, param);
}

export function useGetProductosCliente(param: IgetProductosCliente) {
  const endpoint = endpoints.clientes.getProductosCliente;
  return useMemoizedSendPost(endpoint, param);
}

export function useGetDireccionesCliente(param: IgetProductosCliente) {
  const endpoint = endpoints.clientes.getDireccionesCliente;
  return useMemoizedSendPost(endpoint, param);
}

export function useGetContactosCliente(param: IgetProductosCliente) {
  const endpoint = endpoints.clientes.getContactosCliente;
  return useMemoizedSendPost(endpoint, param);
}



/**
 * Retorna TableQuery de un Usuario determindado
 * @param {uuid} id usuario
 * @returns
 */
export function useGetTableQueryDireccionBId(id: number) {
  const param = {
    module: 'gen',
    tableName: 'articulo',
    primaryKey: 'ide_inarti',
    value:id
  };
  return useGetTableQueryById(param,)
}
