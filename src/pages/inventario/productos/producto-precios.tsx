import { useMemo } from "react";

import { Card } from "@mui/material";

import UltimosPreciosComprasDTQ from './sections/ult-precios-compras-dtq';

import type { IgetUltimosPreciosCompras } from '../../../types/inventario/productos';

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoPrecios({ currentProducto }: Props) {

  const paramGetUltimosPreciosCompras: IgetUltimosPreciosCompras = useMemo(() => (
    { ide_inarti: Number(currentProducto.ide_inarti) }
  ), [currentProducto]);



  return (
    <Card sx={{ pt: 3, pb: 0, px: 2 }}>
      <UltimosPreciosComprasDTQ params={paramGetUltimosPreciosCompras} />
    </Card>
  );

}
