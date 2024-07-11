import React, { useRef, useMemo } from "react";

import { useTableQueryOpciones } from "src/api/sistema";

import { DataTable, useDataTable } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';
// ----------------------------------------------------------------------

export default function OpcionesDAT() {


  const refDataTable = useRef();
  const dataTable = useDataTable({ config: useTableQueryOpciones(null), ref: refDataTable });



  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_opci', visible: false,
    },
    {
      name: 'sis_ide_opci', visible: false,
    },
  ], []);


  return (
    <DataTable
      ref={refDataTable}
      useDataTable={dataTable}
      editable
      rows={50}
      showRowIndex
      numSkeletonCols={11}
      customColumns={customColumns}
    />
  );


}

