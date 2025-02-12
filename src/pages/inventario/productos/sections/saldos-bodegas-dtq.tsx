import type { CustomColumn } from "src/core/types";
import type { IgetSaldo } from 'src/types/inventario/productos';

import { useMemo } from "react";

import { fNumberDecimals } from "src/utils/format-number";

import { useGetSaldoPorBodega } from "src/api/inventario/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type Props = {
  params: IgetSaldo;
};

export default function SaldosBodegasDTQ({ params }: Props) {

  const config = useGetSaldoPorBodega(params);
  const tabQuery = useDataTableQuery({ config });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_inbod', visible: false
    },
    {
      name: 'nombre_inarti', visible: false
    },
    {
      name: 'siglas_inuni', visible: false
    },
    {
      name: 'nombre_inbod', label: 'Bodega'
    },
    {
      name: 'saldo', size: 100, sum: true, renderComponent: renderSaldo
    }
  ], []);

  return (
    <DataTableQuery
      ref={tabQuery.daTabRef}
      useDataTableQuery={tabQuery}
      customColumns={customColumns}
      numSkeletonCols={2}
      staticHeight={202}
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
const renderSaldo = (value: any, row: any) =>
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
