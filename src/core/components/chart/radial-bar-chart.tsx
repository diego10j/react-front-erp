import type { ResponseSWR } from 'src/core/types';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import { Divider } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

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
//   colors?: string[][];
//   series: {
//     label: string;
//     value: number;
//   }[];
//   options?: ChartOptions;
// };

export default function RadialBarChart({ title, subheader, config, indexChart, ...other }: Props) {

  const theme = useTheme();

  const chartColors = [
    [theme.palette.primary.light, theme.palette.primary.main],
    [hexAlpha(theme.palette.warning.light, 0.8), hexAlpha(theme.palette.warning.main, 0.8)],
    [hexAlpha(theme.palette.error.light, 0.8), hexAlpha(theme.palette.error.main, 0.8)],
    [hexAlpha(theme.palette.success.light, 0.8), hexAlpha(theme.palette.success.main, 0.8)],
    [hexAlpha(theme.palette.secondary.light, 0.8), hexAlpha(theme.palette.secondary.main, 0.8)],
    [hexAlpha(theme.palette.info.light, 0.8), hexAlpha(theme.palette.info.main, 0.8)],

    [hexAlpha(theme.palette.warning.light, 0.1), hexAlpha(theme.palette.warning.main, 0.1)],
    [hexAlpha(theme.palette.error.light, 0.1), hexAlpha(theme.palette.error.main, 0.1)],
    [hexAlpha(theme.palette.success.light, 0.1), hexAlpha(theme.palette.success.main, 0.1)],
    [hexAlpha(theme.palette.secondary.light, 0.1), hexAlpha(theme.palette.secondary.main, 0.1)],
    [hexAlpha(theme.palette.info.light, 0.1), hexAlpha(theme.palette.info.main, 0.1)],
  ];

  // Extraemos los datos de dataResponse que está en config
  const { dataResponse, isLoading } = config;
  // Validamos si existe dataResponse y los datos necesarios
  const hasData = dataResponse && dataResponse.charts && dataResponse.charts[indexChart];
  const series = hasData ? dataResponse.charts[indexChart].series : [];
  const chartSeries = series.map((item: { value: any; }) => item.value);
  const total = hasData ? dataResponse.charts[indexChart].total : 0;

  // Generamos chartOptions usando useChart y los datos obtenidos

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors.map((color) => color[1]),
    labels: series.map((item: { label: any; }) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: chartColors.map((color) => [
          { offset: 0, color: color[0], opacity: 1 },
          { offset: 100, color: color[1], opacity: 1 },
        ]),
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { margin: 10, size: '32%' },
        track: { margin: 10, background: varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
        dataLabels: {
          total: { formatter: () => fNumber(total) },
          value: { offsetY: 2, fontSize: theme.typography.h5.fontSize as string },
          name: { offsetY: -10 },
        },
      },
    },
    ...hasData ? dataResponse.charts[indexChart].options : {}, // Solo pasamos opciones si hay datos
  });



  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {isLoading ? (
        <EmptyContent title="No existen Datos" />
      ) : (
        <>
          <Chart
            type="radialBar"
            series={chartSeries}
            options={chartOptions}
            width={{ xs: 300, xl: 320 }}
            height={{ xs: 300, xl: 320 }}
            sx={{ my: 1.5, mx: 'auto' }}
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
