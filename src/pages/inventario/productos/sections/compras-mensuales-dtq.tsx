
import type { CustomColumn } from "src/core/types";
import type { IgetTrnPeriodo } from 'src/types/productos';

import { useMemo, useEffect } from "react";

import { useGetComprasMensuales } from "src/api/inventario//productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
  setDataCompras: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function ComprasMensualesDTQ({ params, setDataCompras }: Props) {

  const config = useGetComprasMensuales(params);
  const tabComprasMen = useDataTableQuery({ config });

  const { data } = tabComprasMen;

  // Asigna la data al grafico
  useEffect(() => {
    if (Array.isArray(data)) {
      const res = data.map((col) => col.cantidad);
      setDataCompras(res);
    }
  }, [data, setDataCompras]);

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'periodo', visible: false
    },
    {
      name: 'nombre_gemes', label: 'Mes', size: 150, visible: true
    },
    {
      name: 'num_facturas', label: '# Facturas', size: 80
    },
    {
      name: 'cantidad', size: 120
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
      staticHeight={337}
      orderable={false}
      showToolbar={false}
      showPagination={false}
    />
  );

}


