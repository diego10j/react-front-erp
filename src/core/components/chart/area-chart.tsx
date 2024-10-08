import type { ResponseSWR } from 'src/core/types';
import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';
import { EmptyContent } from 'src/components/empty-content';

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
//   categories?: string[];
//   series: {
//     name: string;
//     data: number[];
//   }[];
//   options?: ChartOptions;
// };

export default function AreaChart({ title, subheader, config, indexChart, ...other }: Props) {

  const theme = useTheme();

  const chartColors = [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.warning.light, 0.8),
    hexAlpha(theme.palette.error.main, 0.8),
    hexAlpha(theme.palette.info.darker, 0.8),
    hexAlpha(theme.palette.success.main, 0.8),

    hexAlpha(theme.palette.primary.darker, 0.8),
    hexAlpha(theme.palette.warning.main, 0.8),
    hexAlpha(theme.palette.primary.lighter, 0.8),
    hexAlpha(theme.palette.info.main, 0.8),
    hexAlpha(theme.palette.error.light, 0.8),
    hexAlpha(theme.palette.primary.light, 0.8),
    hexAlpha(theme.palette.secondary.main, 0.8),
  ];
  // Extraemos los datos de dataResponse que está en config
  const { dataResponse, isLoading } = config;

  // Validamos si existe dataResponse y los datos necesarios
  const hasData = dataResponse && dataResponse.charts && dataResponse.charts[indexChart];
  const series = hasData ? dataResponse.charts[indexChart].series : [];
  const categories = hasData ? dataResponse.charts[indexChart].categories : [];

  // Generamos chartOptions usando useChart y los datos obtenidos
  const chartOptions = useChart({
    colors: chartColors,
    xaxis: {
      categories,  // Usamos categories extraídas de dataResponse
    },
    legend: { show: true },
    ...hasData ? dataResponse.charts[indexChart].options : {}, // Solo pasamos opciones si hay datos
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {isLoading ? (
        <EmptyContent title="No existen Datos" />
      ) : (
        <Chart
          type="area"
          series={series}
          options={chartOptions}
          height={364}
          sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      )}

    </Card>
  );
}
