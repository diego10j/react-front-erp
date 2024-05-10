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


export type IgetVentasMensuales = {
  ide_inarti: number;
  periodo: number;
};


export type IgetComprasMensuales = {
  ide_inarti: number;
  periodo: number;
};
