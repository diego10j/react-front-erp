import {  useMemo } from "react";

import { Card, CardHeader } from "@mui/material";

import { toTitleCase } from "src/utils/string-util";

import UltimosPreciosComprasDTQ from './dataTables/ult-precios-compras-dtq';

import type { IgetUltimosPreciosCompras } from '../../types/productos';

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoPrecios({ currentProducto }: Props) {

  const paramGetUltimosPreciosCompras: IgetUltimosPreciosCompras = useMemo(() => (
    { ide_inarti: Number(currentProducto.ide_inarti) }
  ), [currentProducto]);



  return (
    <Card>
      <CardHeader title={toTitleCase(currentProducto.nombre_inarti)} sx={{ mb: 2 }}
      />
      <UltimosPreciosComprasDTQ params={paramGetUltimosPreciosCompras}/>
    </Card>
  );

}
