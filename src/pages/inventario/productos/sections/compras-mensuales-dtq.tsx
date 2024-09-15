
import type { CustomColumn } from "src/core/types";
import type { IgetTrnPeriodo } from 'src/types/inventario/productos';

import { useMemo } from "react";

import { fNumberDecimals } from "src/utils/format-number";

import { useGetComprasMensuales } from "src/api/inventario/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
};

export default function ComprasMensualesDTQ({ params }: Props) {

  const config = useGetComprasMensuales(params);
  const tabComprasMen = useDataTableQuery({ config });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'periodo', visible: false
    },
    {
      name: 'siglas_inuni', visible: false
    },
    {
      name: 'nombre_gemes', label: 'Mes', size: 150, visible: true
    },
    {
      name: 'num_facturas', label: '# Fact.', size: 30
    },
    {
      name: 'cantidad', size: 120, renderComponent: renderCantidad
    },
    {
      name: 'total', size: 120, visible: false
    },

  ], []);

  return (
    <DataTableQuery
      ref={tabComprasMen.daTabRef}
      useDataTableQuery={tabComprasMen}
      customColumns={customColumns}
      numSkeletonCols={3}
      staticHeight={338}
      orderable={false}
      showToolbar={false}
      showPagination={false}
    />
  );

}


/**
 * Render Componente de la columna Cantidad.
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
