import type { CustomColumn } from "src/core/types";
import type { IgetTrnPeriodo } from 'src/types/inventario/productos';

import { useMemo } from "react";

import { fNumberDecimals } from "src/utils/format-number";

import { useGetProformasMensuales } from "src/api/inventario/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";
import { Stack, Typography } from '@mui/material';


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
};

export default function ProformasMensualesDTQ({ params }: Props) {

  const config = useGetProformasMensuales(params);
  const tabProfMen = useDataTableQuery({ config });

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
      name: 'num_proformas', label: '# Prof.', size: 30, sum: true
    },
    {
      name: 'cantidad', size: 120, sum: true, renderComponent: renderCantidad
    },
    {
      name: 'total', size: 120, visible: false
    },

  ], []);

  return (
    <DataTableQuery
      ref={tabProfMen.daTabRef}
      useDataTableQuery={tabProfMen}
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
