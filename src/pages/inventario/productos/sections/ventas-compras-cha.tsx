import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  currentYear: string;
  subheader: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      name: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ChartOptions;
  };
}

export default function VentasComprasCHA({ title, currentYear, subheader, chart, ...other }: Props) {
  const { colors, categories, series, options } = chart;

  const [seriesData, setSeriesData] = useState(currentYear);

  useEffect(() => {
    setSeriesData(currentYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);


  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    ...options,
  });



  return (

    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
      />

      {series.map((item) => (
        <Box key={item.name} sx={{ mt: 3, mx: 3 }}>
          {`${item.name}` === seriesData && (
            <Chart
              type="area"
              series={item.data}
              options={chartOptions}
              width="100%"
              height={364}
            />
          )}
        </Box>
      ))}
    </Card>



  );
}
