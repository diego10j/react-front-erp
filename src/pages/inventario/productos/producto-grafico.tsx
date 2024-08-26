import { useMemo, useState } from "react";

import Grid from '@mui/material/Unstable_Grid2';
import { Card, Stack, CardHeader } from "@mui/material";

import { fNumber, fCurrency } from "src/utils/format-number";

import { CONFIG } from 'src/config-global';
import { useGetListDataPeriodos } from "src/api/sistema/general";
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { useGetSumatoriaTrnPeriodo } from "src/api/inventario/productos";

import { AnalyticsWidgetSummary } from "src/sections/overview/analytics/analytics-widget-summary";

import { getYear } from '../../../utils/format-time';
import VentasComprasCHA from './sections/ventas-compras-cha';
import VentasMensualesDTQ from './sections/ventas-mensuales-dtq';
import ComprasMensualesDTQ from './sections/compras-mensuales-dtq';
import TopProveedoresProductoDTQ from './sections/top-proveedores-dtq';

import type { IgetTrnPeriodo } from '../../../types/productos';

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


  const { dataResponse } = useGetSumatoriaTrnPeriodo(paramGetTrnPeriodo);
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
        <AnalyticsWidgetSummary
          title="Cantidad Ventas"
          total={`${fNumber(rows ? rows[0]?.cantidad_ventas : 0)} ${rows ? rows[0]?.unidad : ''} `}
          icon={
            <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-bag.svg`} />
          }
          percent={-0.1}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [56, 47, 40, 62, 73, 30, 23, 54],
          }}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="Valor Ventas"
          total={fCurrency(rows ? rows[0]?.total_ventas : 0)}
          color="info"
          icon={
            <img
              alt="icon"
              src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-users.svg`}
            />
          }
          percent={-0.1}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [56, 47, 40, 62, 73, 30, 23, 54],
          }}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="Cantidad Compras"
          total={`${fNumber(rows ? rows[0]?.cantidad_compras : 0)} ${rows ? rows[0]?.unidad : ''} `}
          color="warning"
          icon={
            <img alt="icon" src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-buy.svg`} />
          }
          percent={-0.1}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [56, 47, 40, 62, 73, 30, 23, 54],
          }}
        />
      </Grid>

      <Grid xs={12} sm={6} md={3}>
        <AnalyticsWidgetSummary
          title="Valor Compras"
          total={fCurrency(rows ? rows[0]?.total_compras : 0)}
          color="error"
          icon={
            <img
              alt="icon"
              src={`${CONFIG.assetsDir}/assets/icons/glass/ic-glass-message.svg`}
            />
          }
          percent={-0.1}
          chart={{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            series: [56, 47, 40, 62, 73, 30, 23, 54],
          }}
        />
      </Grid>


      <Grid xs={12} md={12} lg={12}>
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

      <Grid xs={12} md={12} lg={12}>
        <Card>
          <CardHeader title={`Top Proveedores ${droPeriodos.value}`} />
          <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
            <TopProveedoresProductoDTQ params={paramGetTrnPeriodo} />
          </Stack>
        </Card>
      </Grid>
    </Grid>

  );

}
