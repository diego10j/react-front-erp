
import type { CustomColumn } from "src/core/types";
import type { IgetVentasProducto } from 'src/types/inventario/productos';

import { useMemo } from "react";

import { Box, Link, Stack, Typography, ListItemText } from "@mui/material";

import { fCurrency } from "src/utils/format-number";

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
      name: 'nom_geper', label: 'Cliente', size: 300, renderComponent: renderNombre
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
    <>
      <DataTableQuery
        ref={tabPrecProd.daTabRef}
        useDataTableQuery={tabPrecProd}
        customColumns={columnsPrecProd}
        numSkeletonCols={9}
        showRowIndex
        restHeight={params.cantidad ? 450 : 300}
      />
      {(configPrecProd.isLoading === false && params.cantidad) && (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}

          sx={(theme) => ({
            my: 2,
            border: `dashed 1px ${theme.vars.palette.divider}`,
          })}
        >
          <Stack spacing={1} alignItems="center" justifyContent="center">
            <Typography variant="subtitle2">Precio sugerido</Typography>

            <Typography variant="h2">
              {fCurrency(configPrecProd?.dataResponse.row.precio_sugerido)}

            </Typography>

          </Stack>

          <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column', pr: 2, py: 2 }}>

            <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>
                Precio Máximo
              </Box>
              <Box component="span">
                {fCurrency(configPrecProd?.dataResponse.row.precio_maximo_venta)}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>
                Precio Mínimo
              </Box>
              <Box component="span">
                {fCurrency(configPrecProd?.dataResponse.row.precio_minimo_venta)}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
              <Box component="span" sx={{ color: 'text.secondary' }}>
                Precio Promedio
              </Box>
              <Box component="span">
                {fCurrency(configPrecProd?.dataResponse.row.promedio_precio)}
              </Box>
            </Box>

          </Box>

        </Box>
      )}


    </>
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
