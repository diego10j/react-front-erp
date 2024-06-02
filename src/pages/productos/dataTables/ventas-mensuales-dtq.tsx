
import { useRef, useMemo, useEffect } from "react";

import { fNumberDecimals } from "src/utils/format-number";

import { CustomColumn } from "src/core/types";
import { useGetVentasMensuales } from "src/api/productos";
import { DataTableQuery, useDataTableQuery } from "src/core/components/dataTable";

import { IgetTrnPeriodo } from 'src/types/productos';


// ----------------------------------------------------------------------

type Props = {
  params: IgetTrnPeriodo;
  setDataVentas: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function VentasMensualesDTQ({ params, setDataVentas }: Props) {

  const ref = useRef();
  const config = useGetVentasMensuales(params);
  const tabVentasMen = useDataTableQuery({ config, ref });

  const { data } = tabVentasMen;

  // Asigna la data al grafico
  useEffect(() => {
    if (data) {
      const res = data.map((col) => col.cantidad);
      setDataVentas(res)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'periodo', visible: false
    },
    {
      name: 'nombre_gemes', label: 'Mes', size: 150, visible: true
    },
    {
      name: 'num_facturas', label: '# Facturas', size: 80, sum: true
    },
    {
      name: 'cantidad', size: 120, sum: true, renderComponent: renderCantidad
    },
    {
      name: 'total', size: 120, visible: false
    },

  ], []);

  return (
    <DataTableQuery
      ref={ref}
      useDataTableQuery={tabVentasMen}
      customColumns={customColumns}
      numSkeletonCols={3}
      height={337}
      orderable={false}
      showToolbar={false}
      showPagination={false}
    />
  );

}


/**
 * Render Componente de la columna Transaccion.
 * @param value
 * @param row
 * @returns
 */
const renderCantidad = (value: any, row: any) =>
  < >
    {fNumberDecimals(value)}
  </>
