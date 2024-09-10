import type { ResponseSWR } from 'src/core/types';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import { Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { EmptyContent } from 'src/components/empty-content';
import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  isLoading?: boolean;
  subheader?: string;
  config: ResponseSWR
};

// chart: {
//   colors?: string[];
//   categories?: string[];
//   series: {
//     name: string;
//     data: number[];
//   }[];
//   options?: ChartOptions;
// };

export function PieChart({ title, subheader, config, ...other }: Props) {

  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.warning.light,
    theme.palette.info.dark,
    theme.palette.error.main,
  ];


  // Extraemos los datos de dataResponse que está en config
  const { dataResponse, isLoading } = config;

  // Validamos si existe dataResponse y los datos necesarios
  const series = dataResponse?.chart?.series || [];
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
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...dataResponse?.chart?.options,
  });



  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {isLoading ? (
        <EmptyContent title="No existen Datos" />
      ) : (
        <>
          <Chart
            type="pie"
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
