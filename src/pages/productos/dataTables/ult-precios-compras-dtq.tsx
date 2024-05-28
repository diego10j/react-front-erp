
import { useRef, useMemo } from "react";

import { CustomColumn } from "src/core/types";
import { useGetUltimosPreciosCompras } from "src/api/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import Scrollbar from "src/components/scrollbar";

import { IgetUltimosPreciosCompras } from 'src/types/productos';


// ----------------------------------------------------------------------

type Props = {
  params: IgetUltimosPreciosCompras;
};

export default function UltimosPreciosComprasDTQ({ params }: Props) {


  const refPrecProd = useRef();
  const configPrecProd = useGetUltimosPreciosCompras(params);
  const tabPrecProd = useDataTableQuery({ config: configPrecProd, ref: refPrecProd });


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
      name: 'precio', size: 120
    },
    {
      name: 'total', size: 120
    },

  ], []);


  return (
    <Scrollbar>
      <DataTableQuery
        ref={refPrecProd}
        useDataTableQuery={tabPrecProd}
        customColumns={columnsPrecProd}
        rows={10}
        numSkeletonCols={5}
        height={250}
        orderable={false}
        showToolbar={false}
        showPagination={false}
      />
    </Scrollbar>
  );


}

