import type { IgetStockProductos } from "src/types/inventario/bodegas";

import { useMemo, useState, useCallback } from "react";

import { Box, Link, Stack, Switch, Typography, ListItemText, FormControlLabel } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { useGetStockProductos } from "src/api/inventario/productos";

import { paths } from '../../../../routes/paths';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------
type Props = {
  restHeight?: number;
};

export default function StockProductosDTQ({ restHeight = 280 }: Props) {

  const [onlyStock, setOnlyStock] = useState(false);

  const [params, setParams] = useState<IgetStockProductos>(
    {
      onlyStock
    }
  );

  const config = useGetStockProductos(params);
  const tabProductos = useDataTableQuery({ config });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'uuid', visible: false
    },
    {
      name: 'nombre_inarti', label: 'Producto', renderComponent: renderNombre, size: 380
    },
    {
      name: 'codigo_inarti', visible: false
    },
    {
      name: 'nombre_incate', visible: false
    },
    {
      name: 'color_stock', visible: false
    },
    {
      name: 'detalle_stock', renderComponent: renderDetalleStock, size: 140
    },
    {
      name: 'fecha_corte', visible: true, order: 15, label: 'Fecha Corte', size: 30
    },
    {
      name: 'siglas_inuni', visible: false,
    },
    {
      name: 'detalle_stock', label:'Stock', size: 50, align:'center'
    },
    {
      name: 'existencia', label: 'Existencia', renderComponent: renderExistencia, size: 60
    },
    {
      name: 'stock_minimo', label: 'Stock Min.', renderComponent: renderExistencia, size: 40
    },
    {
      name: 'stock_ideal', label: 'Stock Ideal', renderComponent: renderExistencia, size: 40
    }
  ], []);


  const handleChangeStock = useCallback(
    () => {
      setOnlyStock(!onlyStock);

    },
    [onlyStock]
  );

  return (

    <DataTableQuery
      ref={tabProductos.daTabRef}
      useDataTableQuery={tabProductos}
      customColumns={customColumns}
      rows={100}
      restHeight={restHeight}
      numSkeletonCols={7}
      heightSkeletonRow={60}
      showRowIndex
      actionToolbar={
        <FormControlLabel
          label="Solo Productos con Stock"
          control={<Switch checked={onlyStock} onChange={handleChangeStock} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              sm: 'absolute',
            },
          }}
        />
      }
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
        {row.nombre_incate}
      </Box>
    }
    sx={{ display: 'flex', flexDirection: 'column' }}
  />;

const renderExistencia = (_value: any, row: any) =>
  _value && (
    <Stack
      spacing={1}
      direction="row" sx={{ p: 0 }}
      alignItems="center"
      justifyContent="flex-end" >
      <Typography variant="body1" sx={{ color: 'text.primary' }} noWrap>
        {_value}
      </Typography>
      {(row.siglas_inuni) && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {row.siglas_inuni}
        </Typography>
      )}
    </Stack>
  );

const renderDetalleStock = (_value: any, row: any) =>
  <Box
    component="span"
    sx={{
      typography: 'overline',
      color: row.color_stock
    }}
  >
    {_value}
  </Box>
