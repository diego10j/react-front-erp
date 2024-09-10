import type { ResponseSWR } from 'src/core/types';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';
import { EmptyContent } from 'src/components/empty-content';

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

export function BarChart({ title, subheader, config, ...other }: Props) {

  const theme = useTheme();

  const chartColors = [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.warning.main, 0.8),
    hexAlpha(theme.palette.success.main, 0.8),
    hexAlpha(theme.palette.secondary.main, 0.8),
    hexAlpha(theme.palette.info.main, 0.8),
    hexAlpha(theme.palette.error.main, 0.8),
  ];

  // Extraemos los datos de dataResponse que está en config
  const { dataResponse, isLoading } = config;

  // Validamos si existe dataResponse y los datos necesarios
  const categories = dataResponse?.chart?.categories || [];
  const series = dataResponse?.chart?.series || [];

  // Generamos chartOptions usando useChart y los datos obtenidos
  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,  // Usamos categories extraídas de dataResponse
    },
    legend: {
      show: true,
    },
    ...dataResponse?.chart?.options, // Opciones adicionales desde dataResponse si existen
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {isLoading ? (
        <EmptyContent title="No existen Datos" />
      ) : (
        <Chart
          type="bar"
          series={series}
          options={chartOptions}
          height={364}
          sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      )}

    </Card>
  );
}
