import type { IgetStockProductos } from "src/types/inventario/bodegas";

import { useMemo, useState, useCallback } from "react";

import { Box, Link, Stack, Typography, ListItemText } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { useGetStockProductos } from "src/api/inventario/bodegas";

import { paths } from '../../../../routes/paths';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------
type Props = {
  params: IgetStockProductos
  restHeight?: number;
};

export default function StockProductosDTQ({ params, restHeight = 280 }: Props) {


  const config = useGetStockProductos(params);
  const tabProductos = useDataTableQuery({ config });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'nombre_inarti', label: 'Producto', renderComponent: renderNombre, size: 510
    },
    {
      name: 'codigo_inarti', visible: false
    },
    {
      name: 'color_stock', visible: false
    },
    {
      name: 'detalle_stock', label: 'Stock', align: 'center', renderComponent: renderDetalleStock, size: 150
    },
    {
      name: 'fecha_corte', visible: true, order: 15, label: 'Fecha Corte', size: 30
    },
    {
      name: 'siglas_inuni', visible: false,
    },
    {
      name: 'existencia', label: 'Existencia', renderComponent: renderExistencia, size: 150
    },
    {
      name: 'stock_minimo', label: 'Stock Min.', renderComponent: renderExistencia, size: 150
    },
    {
      name: 'stock_ideal', label: 'Stock Ideal', renderComponent: renderExistencia, size: 150
    },
    {
      name: 'ide_incate', visible: false,
    },
    {
      name: 'otro_nombre_inarti', visible: false,
    },
    {
      name: 'nombre_incate', label: 'Categoria', size: 200,
    },
    {
      name: 'nombre_inbod', label: 'Bodega', size: 270, order: 20
    },
  ], []);



  return (

    <DataTableQuery
      ref={tabProductos.daTabRef}
      useDataTableQuery={tabProductos}
      customColumns={customColumns}
      rows={100}
      restHeight={restHeight}
      numSkeletonCols={7}
      showRowIndex
    />
  );
}

/**
 * Render Componente de la columna nombre_inarti.
 * @param value
 * @param row
 * @returns
 */
const renderNombre = (_value: any, row: any) =>

  <ListItemText
    disableTypography
    primary={
      <Link
        component={RouterLink}
        noWrap
        color="inherit"
        variant="subtitle2"
        href={paths.dashboard.inventario.productos.details(row.uuid)} sx={{ cursor: 'pointer' }}
      >
        {row.nombre_inarti}
      </Link>
    }
    secondary={
      <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
        {row.otro_nombre_inarti}
      </Box>
    }
    sx={{ display: 'flex', flexDirection: 'column' }}
  />;

const renderExistencia = (value: any, row: any) =>
  value && (
    <Stack
      spacing={1}
      direction="row" sx={{ p: 0 }}
      alignItems="center"
      justifyContent="flex-end" >
      <Typography variant="body1" sx={{ color: 'text.primary' }} noWrap>
        {value}
      </Typography>
      {(row.siglas_inuni) && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {row.siglas_inuni}
        </Typography>
      )}
    </Stack>
  );

const renderDetalleStock = (value: any, row: any) =>
  <Box
    component="span"
    sx={{
      typography: 'overline',
      color: row.color_stock
    }}
  >
    {value}
  </Box>
