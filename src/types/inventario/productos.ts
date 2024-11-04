export type IgetTrnProducto = {
  ide_inarti: number;
  fechaInicio: Date | null;
  fechaFin: Date | null;
};


export type IgetSaldo = {
  ide_inarti: number;
};


export type IgetUltimosPreciosCompras = {
  ide_inarti: number;
};

export type IgetTrnPeriodo = {
  ide_inarti: number;
  periodo: number;
};

export type IgetActividades = {
  ide_inarti: number;
};

export type IgetVariacionPreciosCompras = {
  ide_inarti: number;
  fechaInicio: Date | null;
  fechaFin: Date | null;
};

export type IgetComprasProducto = {
  ide_inarti: number;
  fechaInicio: Date | null;
  fechaFin: Date | null;
};

export type IgetVentasProducto = {
  ide_inarti: number;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  cantidad?:number;
};

export type IgetClientes = {
  ide_inarti: number;
  modo: 1 | 2;
}


export type IideInarti = {
  ide_inarti: number;
}


export type IgetCategorias = {
  inv_ide_incate?: number;
}
