
import { useRef, useMemo } from "react";

import { fNumberDecimals } from "src/utils/format-number";

import { CustomColumn } from "src/core/types";
import { useGetTopProveedores } from "src/api/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import { IgetTrnPeriodo } from 'src/types/productos';


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
};

export default function TopProveedoresProductoDTQ({ params }: Props) {

  const ref = useRef();
  const config = useGetTopProveedores(params);
  const tabTabla = useDataTableQuery({ config, ref });

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
      name: 'total_valor', label: 'Valor', size: 120,
    },
    {
      name: 'siglas_inuni', visible: false
    }

  ], []);

  return (
    <DataTableQuery
      ref={ref}
      useDataTableQuery={tabTabla}
      customColumns={customColumns}
      numSkeletonCols={4}
      height={287}
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
