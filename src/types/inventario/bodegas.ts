export type IgetMovimientos = {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  ide_inbod?: number;
};

export type IgetStockProductos = {
  onlyStock?: boolean;
  ide_inbod?: number[];
  fechaCorte?: Date | null;
};

