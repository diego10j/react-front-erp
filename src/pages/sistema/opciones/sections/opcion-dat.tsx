import { useMemo } from "react";

import { useTableQueryOpciones } from "src/api/sistema";

import { DataTable, useDataTable } from '../../../../core/components/dataTable';

import type { CustomColumn } from '../../../../core/types/customColumn';
// ----------------------------------------------------------------------
type Props = {
  selectedItem: string | null;
};

export default function OpcionesDAT({ selectedItem }: Props) {

  const dataTable = useDataTable({ config: useTableQueryOpciones(selectedItem) });

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_opci', visible: false,
    },
    {
      name: 'sis_ide_opci', visible: true, defaultValue: selectedItem,
    },
    {
      name: 'activo_opci', defaultValue: true,
    },
  ], [selectedItem]);





  return (
    <DataTable
      ref={dataTable.daTabRef}
      useDataTable={dataTable}
      editable
      rows={50}
      showRowIndex
      numSkeletonCols={11}
      customColumns={customColumns}
    />
  );


}

