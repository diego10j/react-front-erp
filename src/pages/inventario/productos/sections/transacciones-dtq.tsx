
import type { CustomColumn } from "src/core/types";
import type { IgetTrnProducto } from 'src/types/productos';

import { useRef, useMemo } from "react";

import { useGetTrnProducto } from "src/api/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import { Label }from 'src/components/label/label';
import { Scrollbar} from "src/components/scrollbar";


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnProducto;
};

export default function TransaccionesProductoDTQ({ params }: Props) {


  const refTrnProd = useRef();
  const configTrnProd = useGetTrnProducto(params);
  const tabTrnProd = useDataTableQuery({ config: configTrnProd, ref: refTrnProd });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_indci', visible: false
    },
    {
      name: 'ide_inarti', visible: false
    },
    {
      name: 'ide_incci', visible: false
    },
    {
      name: 'fecha_trans_incci', label: 'Fecha', size: 95
    },
    {
      name: 'nombre_intti', label: 'Transacción', size: 180, renderComponent: renderTransaccion, align: 'center'
    },
    {
      name: 'num_documento', label: 'Doc. Referencia', size: 140
    },
    {
      name: 'nom_geper', label: 'Detalle', size: 400
    },
    {
      name: 'precio', label: 'Costo', size: 120, component: 'Money'
    },
    {
      name: 'ingreso', size: 120
    },
    {
      name: 'egreso', size: 120
    },
    {
      name: 'saldo', size: 120, label: 'Existencia'
    },
  ], []);

  return (
    <Scrollbar>
      <DataTableQuery
        ref={refTrnProd}
        useDataTableQuery={tabTrnProd}
        customColumns={customColumns}
        rows={100}
        numSkeletonCols={8}
        showRowIndex
        orderable={false}
        height={400}
      />
    </Scrollbar>
  );


}


/**
 * Render Componente de la columna Transaccion.
 * @param value
 * @param row
 * @returns
 */
const renderTransaccion = (value: any, row: any) =>
  <Label color={
    (row.ingreso && 'warning') ||
    (row.egreso && 'success') ||
    'default'
  }
  > {value}
  </Label>
