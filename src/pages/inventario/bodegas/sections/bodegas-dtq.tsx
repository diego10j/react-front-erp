import React, { useMemo } from "react";

import { Box, Link, Stack, ListItemText } from "@mui/material";

import { paths } from '../../../../routes/paths';
import { RouterLink } from "../../../../routes/components";
import { useGetBodegas } from '../../../../api/inventario/bodegas';
import { DataTableQuery, useDataTableQuery } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';

// ----------------------------------------------------------------------
type Props = {
  restHeight?: number;
};

export default function BodegasDTQ({ restHeight = 280 }: Props) {

  const config = useGetBodegas();
  const tabBodegas = useDataTableQuery({ config });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'nombre_inbod', label: 'Nombre', renderComponent: renderNombre, size: 380
    },
    {
      name: 'activo_inbod', label: 'Estado', component: 'Active',
    },
    {
      name: 'nombre_geprov', label: 'Ubicación', renderComponent: renderUbicacion, size: 300
    },
    {
      name: 'nombre_gecan', visible: false
    }
  ], []);

  const handleDelete = () => {
    tabBodegas.onDeleteRows('inv_bodega', 'ide_inbod');
  }

  return (
    <DataTableQuery
      ref={tabBodegas.daTabRef}
      useDataTableQuery={tabBodegas}
      customColumns={customColumns}
      restHeight={restHeight}
      numSkeletonCols={7}
      showRowIndex
      showDelete
      onDelete={handleDelete}
    />
  );
}

/**
 * Render Componente de la columna nombre_inbod.
 * @param value
 * @param row
 * @returns
 */
const renderNombre = (_value: any, row: any) =>
  <Stack direction="row" alignItems="center" sx={{ p: 0 }}>
    <ListItemText
      disableTypography
      primary={
        <Link
          component={RouterLink}
          noWrap
          color="inherit"
          variant="subtitle2"
          href={paths.dashboard.inventario.bodegas.edit(row.ide_inbod)} sx={{ cursor: 'pointer' }}
        >
          {row.nombre_inbod}
        </Link>
      }
    />
  </Stack>;

const renderUbicacion = (_value: any, row: any) =>
  <Stack direction="row" alignItems="center" sx={{ p: 0 }}>
    <ListItemText
      primary={row.nombre_geprov}
      secondary={
        <Box component="span" sx={{ typography: 'body2', color: 'text.disabled' }}>
          {row.nombre_gecan}
        </Box>
      }
    />
  </Stack>;

