import React, { useMemo } from "react";

import { Stack, Typography } from "@mui/material";

import { Label } from "src/components/label";

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
      name: 'ide_cnccc', visible: false
    },
    {
      name: 'uuid', visible: false
    },
    {
      name: 'uuid_per', visible: false
    },
    {
      name: 'ide_inbod', visible: false
    },
    {
      name: 'siglas_inuni', visible: false
    },
    {
      name: 'fecha_trans_incci', label: 'Fecha', size: 95
    },
    {
      name: 'nombre_inbod', label: 'Bodega', size: 200
    },
    {
      name: 'nombre_intti', label: 'Transacción', size: 180, renderComponent: renderTransaccion, align: 'center'
    },
    {
      name: 'ingreso', renderComponent: renderIngreso
    },
    {
      name: 'egreso', renderComponent: renderEgreso
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

const renderIngreso = (_value: any, row: any) =>
  <Stack
    spacing={1}
    direction="row" sx={{ p: 0 }}
    alignItems="center"
    justifyContent="flex-end" >
    <Typography variant="body1" sx={{ color: 'text.primary' }} noWrap>
      {row.ingreso}
    </Typography>
    {(row.ingreso) && (
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {row.siglas_inuni}
      </Typography>
    )}
  </Stack>

const renderEgreso = (_value: any, row: any) =>
  <Stack
    spacing={1}
    direction="row" sx={{ p: 0 }}
    alignItems="center"
    justifyContent="flex-end" >
    <Typography variant="body1" sx={{ color: 'text.primary' }} noWrap>
      {row.egreso}
    </Typography>
    {(row.egreso) && (
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {row.siglas_inuni}
      </Typography>
    )}
  </Stack>

/**
 * Render Componente de la columna Transaccion.
 * @param value
 * @param row
 * @returns
 */
const renderTransaccion = (value: any, row: any) =>
  <Label sx={{ p: 1 }} color={
    (row.ingreso && 'warning') ||
    (row.egreso && 'success') ||
    'default'
  }
  > {value}
  </Label>
