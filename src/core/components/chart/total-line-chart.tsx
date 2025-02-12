import type { ResponseSWR } from 'src/core/types';
import type { CardProps } from '@mui/material/Card';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fPercent, fCurrency } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';
import { Chart, useChart } from 'src/components/chart';
import { EmptyContent } from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = CardProps & {
  subheader?: string;
  title: string;
  config: ResponseSWR;
  indexChart: number;
};

export function TotalLineChart({ title, subheader, config, indexChart, sx, ...other }: Props) {
  const theme = useTheme();

  const chartColors = [hexAlpha(theme.palette.primary.lighter, 0.64)];


  // Extraemos los datos de dataResponse que está en config
  const { dataResponse, isLoading } = config;

  // Validamos si existe dataResponse y los datos necesarios
  const hasData = dataResponse && dataResponse.charts && dataResponse.charts[indexChart];
  const series = hasData ? dataResponse.charts[indexChart].series : [];
  const categories = hasData ? dataResponse.charts[indexChart].categories : [];
  const percent = hasData ? dataResponse.charts[indexChart].percent : 0;

  const total = hasData ? dataResponse.charts[indexChart].total : 0;

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    stroke: { width: 3 },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    xaxis: { categories },
    tooltip: {
      y: { formatter: (value: number) => fCurrency(value), title: { formatter: () => '' } },
    },
    ...hasData ? dataResponse.charts[indexChart].options : {},
  });

  const renderTrending = (
    <Box gap={0.5} display="flex" alignItems="flex-end" flexDirection="column">
      <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center', typography: 'subtitle2' }}>
        <Iconify icon={percent >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
        <Box component="span">
          {percent > 0 && '+'}
          {fPercent(percent)}
        </Box>
      </Box>
      <Box component="span" sx={{ opacity: 0.64, typography: 'body2' }}>
        {subheader}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 'none',
        color: 'primary.lighter',
        bgcolor: 'primary.darker',
        ...sx,
      }}
      {...other}
    >
      {(isLoading) ? (
        <EmptyContent title="Sin Datos" />
      ) : (
        <>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
              <Box sx={{ typography: 'h3' }}>{fCurrency( total)}</Box>
            </div>

            {renderTrending}
          </Box>

          <Chart type="line" series={series} options={chartOptions} height={120} />

          <SvgColor
            src={`${CONFIG.assetsDir}/assets/background/shape-square.svg`}
            sx={{
              top: 0,
              left: 0,
              width: 280,
              zIndex: -1,
              height: 280,
              opacity: 0.08,
              position: 'absolute',
              color: 'primary.lighter',
              transform: 'rotate(90deg)',
            }}
          />

        </>
      )}
    </Card>
  );
}
