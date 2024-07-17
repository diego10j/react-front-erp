
import type { CustomColumn } from "src/core/types";
import type { IgetTrnPeriodo } from 'src/types/productos';

import {  useMemo } from "react";

import { fNumberDecimals } from "src/utils/format-number";

import { useGetTopProveedores } from "src/api/inventario//productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
};

export default function TopProveedoresProductoDTQ({ params }: Props) {

  const config = useGetTopProveedores(params);
  const tabTabla = useDataTableQuery({ config });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'nom_geper', label: 'Proveedor',
    },
    {
      name: 'num_facturas', label: '# Facturas', size: 80,
    },
    {
      name: 'total_cantidad', label: 'Cantidad', size: 120, renderComponent: renderCantidad
    },
    {
      name: 'total_valor', label: 'Valor', size: 120,component: 'Money'
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
  < >
    {fNumberDecimals(value)} {row.siglas_inuni}
  </>
