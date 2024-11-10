
import type { CustomColumn } from "src/core/types";
import type { IgetTrnCliente } from "src/types/ventas/clientes";

import { useMemo } from "react";

import { Typography } from "@mui/material";

import { useGetTrnCliente } from "src/api/ventas/clientes";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import { Label } from 'src/components/label/label';


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnCliente;
};

export default function TransaccionesClienteDTQ({ params }: Props) {

  const configTrn = useGetTrnCliente(params);
  const tabTrn = useDataTableQuery({ config: configTrn });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_ccdtr', visible: false
    },
    {
      name: 'ide_cnccc', visible: false
    },
    {
      name: 'ide_teclb', visible: false
    },
    {
      name: 'fecha_trans_ccdtr', label: 'Fecha', size: 100
    },
    {
      name: 'transaccion', label: 'Transacción', size: 180, renderComponent: renderTransaccion, align: 'center'
    },
    {
      name: 'observacion', size: 400,renderComponent:renderTextCaption
    },
    {
      name: 'docum_relac_ccdtr', label: 'Doc. Referencia', size: 130,renderComponent:renderTextCaption
    },
    {
      name: 'debe', size: 120, component: 'Money'
    },
    {
      name: 'haber', size: 120, component: 'Money'
    },
    {
      name: 'saldo', size: 120, label: 'Saldo', component: 'Money'
    },
    {
      name: 'fecha_venci_ccdtr', label: 'Fecha Efectivo', size: 120, align:'right'
    },
  ], []);

  return (

    <DataTableQuery
      ref={tabTrn.daTabRef}
      useDataTableQuery={tabTrn}
      customColumns={customColumns}
      rows={100}
      numSkeletonCols={8}
      showRowIndex
      orderable={false}
      restHeight={400}
    />

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
    (row.debe && 'warning') ||
    (row.haber && 'success') ||
    'default'
  }
  >
    <Typography variant="caption" >
      {value}
    </Typography>
  </Label>


const renderTextCaption = (value: any, row: any) =>

  <Typography variant="caption" >
    {value}
  </Typography>

