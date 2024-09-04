export type IGetEventosAuditoria = {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  ide_usua?: number;
}

export type IDeleteEventosAuditoria = {
  fechaInicio: Date | null;
  fechaFin: Date | null;
  ide_auac: string[];
}
