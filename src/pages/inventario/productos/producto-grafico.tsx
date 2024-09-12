import { useMemo, useState } from "react";

import Grid from '@mui/material/Unstable_Grid2';
import { Card, Stack, CardHeader } from "@mui/material";

import { fNumber, fCurrency } from "src/utils/format-number";

import { useGetListDataPeriodos } from "src/api/sistema/general";
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { WidgetSummary } from "src/core/components/widget/widget-summary";
import { useChartVentasPeriodo, useGetSumatoriaTrnPeriodo } from "src/api/inventario/productos";

import { getYear } from '../../../utils/format-time';
import VentasComprasCHA from './sections/ventas-compras-cha';
import TopClientesProductoDTQ from "./sections/top-clientes-dtq";
import VentasMensualesDTQ from "./sections/ventas-mensuales-dtq";
import ComprasMensualesDTQ from "./sections/compras-mensuales-dtq";
import TopProveedoresProductoDTQ from './sections/top-proveedores-dtq';
import { PieChart, BarChart, DonutChart, RadialBarChart } from '../../../core/components/chart';

import type { IgetTrnPeriodo } from '../../../types/inventario/productos';

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoGraficos({ currentProducto }: Props) {



  const droPeriodos = useDropdown({ config: useGetListDataPeriodos(), defaultValue: `${getYear()}` });
  // useState(getYear());

  const [dataVentas, setDataVentas] = useState<any[]>([]);

  const [dataCompras, setDataCompras] = useState<any[]>([]);



  const paramGetTrnPeriodo: IgetTrnPeriodo = useMemo(() => (
    {
      ide_inarti: Number(currentProducto.ide_inarti),
      periodo: Number(droPeriodos.value)
    }
  ), [currentProducto, droPeriodos.value]);


  const { dataResponse, isLoading } = useGetSumatoriaTrnPeriodo(paramGetTrnPeriodo);

  const configCharts = useChartVentasPeriodo(paramGetTrnPeriodo);




  const { rows } = dataResponse;

  return (
    <Grid container spacing={3}>

      <Grid xs={12} sm={12} md={12}>
        <Dropdown
          label="Año"
          showEmptyOption={false}
          useDropdown={droPeriodos}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>

        <WidgetSummary
          title="Cantidad Vendida"
          isLoading={isLoading}
          total={`${fNumber(rows ? rows[0]?.cantidad_ventas : 0)} ${rows ? rows[0]?.unidad : ''} `}
          icon="game-icons:weight"
        />

      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <WidgetSummary
          color="success"
          isLoading={isLoading}
          title="Valor Ventas"
          total={fCurrency(rows ? rows[0]?.total_ventas : 0)}
          icon="carbon:sales-ops"
        />

      </Grid>

      <Grid xs={12} sm={6} md={3}>

        <WidgetSummary
          title="Cantidad Comprada"
          isLoading={isLoading}
          total={`${fNumber(rows ? rows[0]?.cantidad_compras : 0)} ${rows ? rows[0]?.unidad : ''} `}
          icon="game-icons:weight"
          color="secondary"
        />


      </Grid>

      <Grid xs={12} sm={6} md={3}>

        <WidgetSummary
          color="info"
          isLoading={isLoading}
          title="Valor Compras"
          total={fCurrency(rows ? rows[0]?.total_compras : 0)}
          icon="carbon:sales-ops"
        />


      </Grid>

      <Grid xs={12} md={12} lg={12}>
        <BarChart
          title={`Movimientos ${droPeriodos.value}`}
          subheader={currentProducto.nombre_inarti}
          config={configCharts}
          indexChart={4}
        />
      </Grid>

      <Grid xs={12} md={6} lg={8}>

        <VentasComprasCHA
          title={`Ventas / Compras ${droPeriodos.value}`}
          currentYear={`${droPeriodos.value}`}
          subheader={currentProducto.nombre_inarti}
          chart={{
            categories: [
              'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
              'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
            ],
            series: [
              {
                name: droPeriodos.value || '',
                data: [
                  {
                    name: 'Ventas',
                    data: dataVentas,
                  },
                  {
                    name: 'Compras',
                    data: dataCompras,
                  },
                ],
              },]
          }}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <PieChart
          title={`% de Ventas ${droPeriodos.value} por Id Cliente `}
          config={configCharts}
          indexChart={1}
        />

      </Grid>

      <Grid xs={12} md={6} lg={6}>
        <Card>
          <CardHeader title={`Ventas ${droPeriodos.value}`} />
          <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
            <VentasMensualesDTQ params={paramGetTrnPeriodo} setDataVentas={setDataVentas} />
          </Stack>
        </Card>
      </Grid>

      <Grid xs={12} md={6} lg={6}>
        <Card>
          <CardHeader title={`Compras ${droPeriodos.value}`} />
          <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
            <ComprasMensualesDTQ params={paramGetTrnPeriodo} setDataCompras={setDataCompras} />
          </Stack>
        </Card>
      </Grid>



      <Grid xs={12} md={6} lg={8}>
        <BarChart
          title={`Ventas ${droPeriodos.value} por forma de pago`}
          config={configCharts}
          indexChart={0}
        />
      </Grid>

      <Grid xs={12} md={6} lg={4}>
        <RadialBarChart
          title={`Ventas ${droPeriodos.value} por vendedor `}
          config={configCharts}
          indexChart={3}
        />
      </Grid>




      <Grid xs={12} md={6} lg={4}>
        <DonutChart
          title={`Ventas ${droPeriodos.value} por tipo Id Cliente`}
          config={configCharts}
          indexChart={2}
        />
      </Grid>

      <Grid xs={12} md={6} lg={6}>
        <Card>
          <CardHeader title={`Top Proveedores ${droPeriodos.value}`} />
          <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
            <TopProveedoresProductoDTQ params={paramGetTrnPeriodo} />
          </Stack>
        </Card>
      </Grid>

      <Grid xs={12} md={6} lg={6}>
        <Card>
          <CardHeader title={`Top Clientes ${droPeriodos.value}`} />
          <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
            <TopClientesProductoDTQ params={paramGetTrnPeriodo} />
          </Stack>
        </Card>
      </Grid>
    </Grid>

  );

}
