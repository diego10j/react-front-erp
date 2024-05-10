import { useMemo, useState } from "react";

import { useSettingsContext } from 'src/components/settings';

import { IgetVentasMensuales, IgetComprasMensuales } from '../../types/productos';
import { Card, CardHeader, Container, Stack } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { toTitleCase } from "src/utils/string-util";
import VentasMensualesDTQ from './dataTables/ventas-mensuales-dtq';
import ComprasMensualesDTQ from './dataTables/compras-mensuales-dtq';
import VentasComprasCHA from "./charts/ventas-compras-cha";
import { getYear } from "../../utils/format-time";

// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoGraficos({ currentProducto }: Props) {

  const settings = useSettingsContext();

  const [currentYear, setCurrentYear] = useState(2022); // useState(getYear());

  const [dataVentas, setDataVentas] = useState([]);

  const [dataCompras, setDataCompras] = useState([]);

  const paramGetVentasMensuales: IgetVentasMensuales = useMemo(() => (
    {
      ide_inarti: Number(currentProducto.ide_inarti),
      periodo: currentYear
    }
  ), [currentProducto]);


  const paramGetComprasMensuales: IgetComprasMensuales = useMemo(() => (
    {
      ide_inarti: Number(currentProducto.ide_inarti),
      periodo: currentYear
    }
  ), [currentProducto]);


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Grid container spacing={3}>

        <Grid xs={12} md={12} lg={12}>
          <VentasComprasCHA
            title={`Ventas / Compras ${currentYear}`}
            currentYear={`${currentYear}`}
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
                  year: `${currentYear}`,
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
                },],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title={`Ventas ${currentYear}`} />
            <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
              <VentasMensualesDTQ params={paramGetVentasMensuales} setDataVentas={setDataVentas} />
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <Card>
            <CardHeader title={`Compras ${currentYear}`} />
            <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
              <ComprasMensualesDTQ params={paramGetComprasMensuales} setDataCompras={setDataCompras} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );

}
