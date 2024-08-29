import React, { useMemo } from "react";

import { Box, Link, Stack, ListItemText } from "@mui/material";

import { Label } from "src/components/label";

import { paths } from '../../../../routes/paths';
import { RouterLink } from "../../../../routes/components";
import { useGetMovimientos } from '../../../../api/inventario/bodegas';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';
import type { IgetMovimientos } from '../../../../types/inventario/bodegas';

// ----------------------------------------------------------------------
type Props = {
  params: IgetMovimientos
  restHeight?: number,
};

export default function MovimientosInventarioDTQ({ restHeight = 280, params }: Props) {

  const config = useGetMovimientos(params);
  const tabMovInv = useDataTableQuery({ config });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_incci', visible: false
    },
    {
      name: 'numero_incci', visible: false
    },
    {
      name: 'ide_cnccc', visible: false
    },
    {
      name: 'uuid', visible: false
    },
    {
      name: 'ide_inbod', visible: false
    },
    {
      name: 'fecha_trans_incci', label: 'Fecha', size: 95
    },
    {
      name: 'nombre_inbod', label: 'Bodega', renderComponent: renderNombreBodega, size: 250
    },
    {
      name: 'nombre_intti', label: 'Transacción', size: 180, renderComponent: renderTransaccion, align: 'center'
    },
  ], []);

  return (
    <DataTableQuery
      ref={tabMovInv.daTabRef}
      useDataTableQuery={tabMovInv}
      customColumns={customColumns}
      restHeight={restHeight}
      rows={100}
      numSkeletonCols={9}
      showRowIndex
    />
  );
}

/**
 * Render Componente de la columna nombre_inbod.
 * @param value
 * @param row
 * @returns
 */
const renderNombreBodega = (_value: any, row: any) =>
  <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
    <ListItemText
      disableTypography
      primary={
        <Link
          component={RouterLink}
          noWrap
          color="inherit"
          variant="subtitle2"
          href={paths.dashboard.inventario.bodegas.details(row.ide_inbod)} sx={{ cursor: 'pointer' }}
        >
          {row.nombre_inbod}
        </Link>
      }
      secondary={
        <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
          {row.numero_incci}
        </Box>
      }
    />
  </Stack>;

/**
 * Render Componente de la columna Transaccion.
 * @param value
 * @param row
 * @returns
 */
const renderTransaccion = (value: any, row: any) =>
  <Label color={
    (row.ingreso && 'warning') ||
    (row.egreso && 'success') ||
    'default'
  }
  > {value}
  </Label>
