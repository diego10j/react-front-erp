import React, { useMemo } from "react";

import { Link, Stack, ListItemText } from "@mui/material";

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
      name: 'nombre_inbod', label: 'Nombre', renderComponent: renderNombre, size: 300
    },
  ], []);

  return (
    <DataTableQuery
      ref={tabBodegas.daTabRef}
      useDataTableQuery={tabBodegas}
      customColumns={customColumns}
      restHeight={restHeight}
      rows={100}
      numSkeletonCols={7}
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
const renderNombre = (_value: any, row: any) =>
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
    />
  </Stack>;

