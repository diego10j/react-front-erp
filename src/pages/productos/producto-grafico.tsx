import { useMemo, useState } from "react";

import Grid from '@mui/material/Unstable_Grid2';
import { Card, Stack, Container, CardHeader } from "@mui/material";

import { toTitleCase } from "src/utils/string-util";

import { useGetListDataPeriodos } from "src/api/general/general";
import Dropdown, { useDropdown } from 'src/core/components/dropdown';

import { useSettingsContext } from 'src/components/settings';

import AnalyticsWidgetSummary from "src/sections/overview/analytics/analytics-widget-summary";

import { getYear } from '../../utils/format-time';
import VentasComprasCHA from "./charts/ventas-compras-cha";
import VentasMensualesDTQ from './dataTables/ventas-mensuales-dtq';
import ComprasMensualesDTQ from './dataTables/compras-mensuales-dtq';
import { IgetVentasMensuales, IgetComprasMensuales } from '../../types/productos';

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoGraficos({ currentProducto }: Props) {

  const settings = useSettingsContext();

  const droPeriodos = useDropdown({ config: useGetListDataPeriodos(), defaultValue: `${getYear()}` });
  useState(getYear());

  const [dataVentas, setDataVentas] = useState<any[]>([]);

  const [dataCompras, setDataCompras] = useState<any[]>([]);

  const paramGetVentasMensuales: IgetVentasMensuales = useMemo(() => (
    {
      ide_inarti: Number(currentProducto.ide_inarti),
      periodo: Number(droPeriodos.value)
    }
  ), [currentProducto, droPeriodos.value]);


  const paramGetComprasMensuales: IgetComprasMensuales = useMemo(() => (
    {
      ide_inarti: Number(currentProducto.ide_inarti),
      periodo: Number(droPeriodos.value)
    }
  ), [currentProducto, droPeriodos.value]);



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

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
            title="Weekly Sales"
            total={714000}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Item Orders"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>


        <Grid xs={12} md={12} lg={12}>
          <VentasComprasCHA
            title={`Ventas / Compras ${droPeriodos.value}`}
            currentYear={`${droPeriodos.value}`}
            subheader={toTitleCase(currentProducto.nombre_inarti)}
            chart={{
              categories: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
              ],
              series: [
                {
                  year: droPeriodos.value || '',
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
              <VentasMensualesDTQ params={paramGetVentasMensuales} setDataVentas={setDataVentas} />
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title={`Compras ${droPeriodos.value}`} />
            <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
              <ComprasMensualesDTQ params={paramGetComprasMensuales} setDataCompras={setDataCompras} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

}