
import type { CustomColumn } from "src/core/types";
import type { IgetVentasProducto } from 'src/types/inventario/productos';

import { useMemo } from "react";

import { Box, Link, Stack, Typography, ListItemText } from "@mui/material";

import { useGetVentasProducto } from "src/api/inventario/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";


// ----------------------------------------------------------------------

type Props = {
  params: IgetVentasProducto;
};

export default function PreciosVentasDTQ({ params }: Props) {

  const configPrecProd = useGetVentasProducto(params);
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
      name: 'nom_geper', label: 'Proveedor', size: 300, renderComponent: renderNombre
    },
    {
      name: 'fecha_emisi_cccfa', label: 'Fecha', size: 100
    },
    {
      name: 'cantidad_ccdfa', label: 'Cantidad', size: 120, renderComponent: renderCantidad
    },
    {
      name: 'precio_ccdfa', label: 'Precio', size: 120, component: 'Money'
    },
    {
      name: 'total_ccdfa', label: 'Total', size: 120, component: 'Money'
    },

  ], []);


  return (
    <DataTableQuery
      ref={tabPrecProd.daTabRef}
      useDataTableQuery={tabPrecProd}
      customColumns={columnsPrecProd}
      rows={25}
      numSkeletonCols={5}
      showRowIndex
      restHeight={400}
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
          {row.nom_geper}
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
