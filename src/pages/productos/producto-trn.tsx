import { useRef, useMemo } from "react";

import { Card } from "@mui/material";

// import { addDaysDate } from "src/utils/format-time";

import { CustomColumn } from "src/core/types";
import { useGetTrnProducto } from "src/api/productos";
// import { useCalendarRangePicker } from "src/core/components/calendar";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import Scrollbar from "src/components/scrollbar";


type Props = {
  currentProducto: any;
};

export default function ProductoTrn({ currentProducto }: Props) {

  // const calFechas = useCalendarRangePicker((addDaysDate(new Date(), -3)), new Date());

  const fechaInicio = new Date('2023-01-01');
  const fechaFin = new Date('2024-01-01');

  const refTrnProd = useRef();
  const config = useGetTrnProducto(1702, fechaInicio, fechaFin);
  const tabTrnProd = useDataTableQuery({ config, ref: refTrnProd });


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_indci', visible: false
    },
    {
      name: 'ide_incci', visible: false
    }
  ], []);


  return (
    <Card>
      <Scrollbar>
        <DataTableQuery
          ref={refTrnProd}
          useDataTableQuery={tabTrnProd}
          customColumns={customColumns}
          rows={10}
          numSkeletonCols={8}
          height={680}
          showRowIndex
        />
      </Scrollbar>
    </Card>
  );


}
