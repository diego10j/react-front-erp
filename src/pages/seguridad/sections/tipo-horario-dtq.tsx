import React,{ useMemo } from "react";


import { useTableQueryTiposHorario } from 'src/api/sistema/seguridad';


import { DataTable, useDataTable } from 'src/core/components/dataTable';

import type { CustomColumn } from 'src/core/types/customColumn';
// ----------------------------------------------------------------------

export default function TipoHorarioDTQ() {

  const configTable = useTableQueryTiposHorario();
  const tabQuery = useDataTable({ config: configTable });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_tihor', visible: false
    },
    {
      name: 'activo_tihor', defaultValue: true, align: 'center', label: 'Estado'
    },
  ], []);


  return (
    <DataTable
      ref={tabQuery.daTabRef}
      restHeight={360}
      useDataTable={tabQuery}
      customColumns={customColumns}
      rows={25}
      numSkeletonCols={3}
      showRowIndex
    />

  );


}

