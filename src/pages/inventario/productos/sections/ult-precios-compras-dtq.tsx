
import type { CustomColumn } from "src/core/types";
import type { IgetUltimosPreciosCompras } from 'src/types/productos';

import { useMemo } from "react";

import { useGetUltimosPreciosCompras } from "src/api/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import { Scrollbar } from "src/components/scrollbar";


// ----------------------------------------------------------------------

type Props = {
  params: IgetUltimosPreciosCompras;
};

export default function UltimosPreciosComprasDTQ({ params }: Props) {

  const configPrecProd = useGetUltimosPreciosCompras(params);
  const tabPrecProd = useDataTableQuery({ config: configPrecProd });


  const columnsPrecProd: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_geper', visible: false
    },
    {
      name: 'nom_geper', label: 'Proveedor', size: 400
    },
    {
      name: 'fecha_ultima_venta', label: 'Fecha', size: 80
    },
    {
      name: 'cantidad', size: 120
    },
    {
      name: 'precio', size: 120, component: 'Money'
    },
    {
      name: 'total', size: 120, component: 'Money'
    },

  ], []);


  return (
    <Scrollbar>
      <DataTableQuery
        ref={tabPrecProd.daTabRef}
        useDataTableQuery={tabPrecProd}
        customColumns={columnsPrecProd}
        rows={25}
        numSkeletonCols={5}
        showPagination={false}
        showRowIndex
      />
    </Scrollbar>
  );


}


