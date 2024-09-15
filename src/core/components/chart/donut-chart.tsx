import type { ResponseSWR } from 'src/core/types';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import { Divider } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { EmptyContent } from 'src/components/empty-content';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  config: ResponseSWR;
  indexChart: number;
  title?: string;
  isLoading?: boolean;
  subheader?: string;
};

// chart: {
//   colors?: string[];
//   series: {
//     label: string;
//     value: number;
//   }[];
//   options?: ChartOptions;
// }

export default function DonutChart({ title, subheader, config, indexChart, ...other }: Props) {

  const theme = useTheme();

  const chartColors = [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.primary.light, 0.8),
    hexAlpha(theme.palette.primary.darker, 0.8),
    hexAlpha(theme.palette.primary.lighter, 0.8),
    hexAlpha(theme.palette.warning.main, 0.1),
    hexAlpha(theme.palette.info.main, 0.8),
    hexAlpha(theme.palette.error.light, 0.8),

    hexAlpha(theme.palette.success.main, 0.1),
    hexAlpha(theme.palette.secondary.main, 0.1),
    hexAlpha(theme.palette.info.darker, 0.1),
    hexAlpha(theme.palette.error.main, 0.1),
  ];

  // Extraemos los datos de dataResponse que está en config
  const { dataResponse, isLoading } = config;

  // Validamos si existe dataResponse y los datos necesarios
  const hasData = dataResponse && dataResponse.charts && dataResponse.charts[indexChart];
  const series = hasData ? dataResponse.charts[indexChart].series : [];
  const chartSeries = series.map((item: { value: any; }) => item.value);

  // Generamos chartOptions usando useChart y los datos obtenidos

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: series.map((item: { label: any; }) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            value: { formatter: (value: number | string) => fNumber(value) },
            total: {
              formatter: (w: {
                globals: {
                  seriesTotals: number[];
                };
              }) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...hasData ? dataResponse.charts[indexChart].options : {}, // Solo pasamos opciones si hay datos
  });



  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {(isLoading || chartSeries.length === 0) ? (
        <EmptyContent title="Sin Datos"    sx={{ py: 10, height: 'auto', flexGrow: 'unset' }} />
      ) : (
        <>
          <Chart
            type="donut"
            series={chartSeries}
            options={chartOptions}
            width={{ xs: 240, xl: 260 }}
            height={{ xs: 240, xl: 260 }}
            sx={{ my: 6, mx: 'auto' }}
          />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <ChartLegends
            labels={chartOptions?.labels}
            colors={chartOptions?.colors}
            sx={{ p: 3, justifyContent: 'center' }}
          />
        </>
      )}

    </Card>
  );
}
