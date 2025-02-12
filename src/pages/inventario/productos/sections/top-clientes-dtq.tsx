
import type { CustomColumn } from "src/core/types";
import type { IgetTrnPeriodo } from 'src/types/inventario/productos';

import {  useMemo } from "react";

import { Box , Link, Stack, Typography , ListItemText } from "@mui/material";

import { fCurrency, fNumberDecimals } from "src/utils/format-number";

import { useGetTopClientes } from "src/api/inventario/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
};

export default function TopClientesProductoDTQ({ params }: Props) {

  const config = useGetTopClientes(params);
  const tabTabla = useDataTableQuery({ config });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'nom_geper', label: 'Cliente',  size: 300, renderComponent: renderNombre
    },
    {
      name: 'num_facturas', label: '# Facturas', size: 50,
    },
    {
      name: 'total_cantidad', label: 'Cantidad', size: 120, renderComponent: renderCantidad
    },
    {
      name: 'total_valor', visible: false
    },
    {
      name: 'siglas_inuni', visible: false
    }

  ], []);

  return (
    <DataTableQuery
      ref={tabTabla.daTabRef}
      useDataTableQuery={tabTabla}
      customColumns={customColumns}
      numSkeletonCols={4}
      staticHeight={287}
      orderable={false}
      showToolbar={false}
      showPagination={false}
    />
  );

}


/**
 * Render Componente de la columna Transaccion.
 * @param value
 * @param row
 * @returns
 */
const renderCantidad = (value: any, row: any) =>
  <Stack
    spacing={1}
    direction="row" sx={{ p: 0 }}
    alignItems="center"
    justifyContent="flex-end" >
    <Typography variant="body1" sx={{ color: 'text.primary' }} noWrap>
    {fNumberDecimals(value)}
    </Typography>

    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
    {row.siglas_inuni}
    </Typography>

  </Stack>

const renderNombre = (value: any, row: any) =>
  <Stack direction="row" alignItems="center" sx={{ py: 0 }}>
    <ListItemText
      disableTypography
      primary={

        <Link noWrap sx={{ color: 'text.primary', typography: 'subtitle2' }}>
         {value}
        </Link>

      }
      secondary={
        <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
           {fCurrency(row.total_valor)}
        </Box>
      }
      sx={{ display: 'flex', flexDirection: 'column' }}
    />
  </Stack>;
