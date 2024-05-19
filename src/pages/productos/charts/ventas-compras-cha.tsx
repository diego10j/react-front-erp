import { ApexOptions } from 'apexcharts';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  currentYear: string;
  subheader: string;
  chart: {
    categories?: string[];
    colors?: string[];
    series: {
      year: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ApexOptions;
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
        <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
          {item.year === seriesData && (
            <Chart
              dir="ltr"
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
