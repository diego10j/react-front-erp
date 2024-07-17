import { useMemo } from "react";

import { useTableQueryOpcion } from "src/api/sistema/admin";

import { DataTable, useDataTable } from '../../../../core/components/dataTable';

import type { CustomColumn } from 'src/core/types/customColumn';
import type { ITableQueryOpciones } from 'src/types/admin';
// ----------------------------------------------------------------------
type Props = {
  params: ITableQueryOpciones;
};

export default function OpcionesDAT({ params }: Props) {

  const dataTable = useDataTable({ config: useTableQueryOpcion(params) });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_opci', visible: false,
    },
    {
      name: 'sis_ide_opci', visible: true, defaultValue: params.sis_ide_opci,
    },
    {
      name: 'activo_opci', defaultValue: true,
    },
  ], [params.sis_ide_opci]);





  return (
    <DataTable
      ref={dataTable.daTabRef}
      useDataTable={dataTable}
      editable
      rows={50}
      showRowIndex
      numSkeletonCols={11}
      customColumns={customColumns}
      restHeight={400}
    />
  );


}

