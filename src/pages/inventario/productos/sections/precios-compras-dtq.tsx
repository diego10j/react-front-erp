
import type { CustomColumn } from "src/core/types";
import type { IgetComprasProducto } from 'src/types/inventario/productos';

import { useMemo } from "react";

import { Box, Link, Stack, Typography, ListItemText } from "@mui/material";

import { useGetComprasProducto } from "src/api/inventario/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";


// ----------------------------------------------------------------------

type Props = {
  params: IgetComprasProducto;
};

export default function PreciosComprasDTQ({ params }: Props) {

  const configPrecProd = useGetComprasProducto(params);
  const tabPrecProd = useDataTableQuery({ config: configPrecProd });

  const columnsPrecProd: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'siglas_inuni', visible: false
    },
    {
      name: 'numero_cpcfa', visible: false
    },
    {
      name: 'nom_geper', label: 'Proveedor', size: 300, renderComponent: renderNombre
    },
    {
      name: 'fecha_emisi_cpcfa', label: 'Fecha', size: 100
    },
    {
      name: 'cantidad_cpdfa', label: 'Cantidad', size: 120, renderComponent: renderCantidad
    },
    {
      name: 'precio_cpdfa', label: 'Precio', size: 120, component: 'Money'
    },
    {
      name: 'valor_cpdfa', label: 'Total', size: 120, component: 'Money'
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
      {row.cantidad_cpdfa}
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
          FACT.  {row.numero_cpcfa}
        </Box>
      }
      sx={{ display: 'flex', flexDirection: 'column' }}
    />
  </Stack>;
