
import type { CustomColumn } from "src/core/types";
import type { IgetTrnCliente } from "src/types/ventas/clientes";

import { useMemo } from "react";

import { Box, Link, Stack, Typography, ListItemText } from "@mui/material";

import { useGetVentasConUtilidad } from "src/api/ventas/clientes";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnCliente;
};

export default function ClientesVentasDTQ({ params }: Props) {

  const configPrecProd = useGetVentasConUtilidad(params);
  const tabPrecProd = useDataTableQuery({ config: configPrecProd });

  const columnsPrecProd: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'siglas_inuni', visible: false
    },
    {
      name: 'secuencial_cccfa', visible: false
    },
    {
      name: 'nombre_inarti', label: 'Producto', size: 300, renderComponent: renderNombre
    },
    {
      name: 'fecha_emisi_cccfa', label: 'Fecha', size: 100
    },
    {
      name: 'cantidad_ccdfa', label: 'Cantidad', size: 120, renderComponent: renderCantidad
    },
    {
      name: 'precio_venta', label: 'Precio', size: 120, component: 'Money'
    },
    {
      name: 'total_ccdfa', label: 'Total', size: 120, component: 'Money'
    },
    {
      name: 'precio_compra', label: 'Precio Compra', size: 120, component: 'Money'
    },
    {
      name: 'utilidad_neta', label: 'Utilidad Neta', size: 120, component: 'Money'
    },
    {
      name: 'porcentaje_utilidad', label: '% Utilidad', size: 120, component: 'Percent'
    },
  ], []);




  return (
    <DataTableQuery
      ref={tabPrecProd.daTabRef}
      useDataTableQuery={tabPrecProd}
      customColumns={columnsPrecProd}
      numSkeletonCols={9}
      showRowIndex
      restHeight={300}
    />
  );

}



const renderCantidad = (_value: any, row: any) =>
  <Stack
    spacing={1}
    direction="row" sx={{ p: 0 }}
    alignItems="center"
    justifyContent="flex-end" >
    <Typography variant="body1" sx={{ color: 'text.primary' }} noWrap>
      {row.cantidad_ccdfa}
    </Typography>

    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
      {row.siglas_inuni}
    </Typography>

  </Stack>


const renderNombre = (_value: any, row: any) =>
  <Stack direction="row" alignItems="center" sx={{ py: 0 }}>
    <ListItemText
      disableTypography
      primary={

        <Link noWrap sx={{ color: 'text.primary', typography: 'subtitle2' }}>
          {row.nombre_inarti}
        </Link>
      }
      secondary={
        <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
          FACT.  {row.secuencial_cccfa}
        </Box>
      }
      sx={{ display: 'flex', flexDirection: 'column' }}
    />
  </Stack>;
