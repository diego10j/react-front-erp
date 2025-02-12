
import dayjs from "dayjs";
import { toast } from "sonner";
import { useMemo, useState } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Grid, Stack, Button, CardHeader } from "@mui/material";

import { formatStr, addDaysDate, convertDayjsToDate } from "src/utils/format-time";

import { useCalendarRangePicker } from "src/core/components/calendar";
import { TotalLineChart } from "src/core/components/chart/total-line-chart";
import { useChartVariacionPreciosCompras } from "src/api/inventario/productos";

import { Iconify } from "src/components/iconify";

import PreciosComprasDTQ from "./sections/precios-compras-dtq";
import UltimosPreciosCompras from './sections/ult-precios-compras';

import type { IgetComprasProducto, IgetUltimosPreciosCompras } from '../../../types/inventario/productos';



// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoPreciosCompras({ currentProducto }: Props) {

  const paramGetUltimosPreciosCompras: IgetUltimosPreciosCompras = useMemo(() => (
    { ide_inarti: Number(currentProducto.ide_inarti) }
  ), [currentProducto]);


  const configCharts = useChartVariacionPreciosCompras(paramGetUltimosPreciosCompras);

  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -180)), dayjs(new Date()));

  const [paramsGetComprasProducto, setParamsGetComprasProducto] = useState<IgetComprasProducto>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
      ide_inarti: Number(currentProducto.ide_inarti)
    }
  );


  const handleBuscar = () => {
    if (!isError) {
      setParamsGetComprasProducto({
        ...paramsGetComprasProducto,
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
      });
    } else {
      toast.warning('Fechas no válidas');
    }
  };


  return (

    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>

          <Stack
            spacing={2}
            justifyContent="center"
            alignItems="center"  // Centrará el contenido verticalmente
            direction={{
              xs: 'column',
              md: 'row',
            }}
            sx={{ p:2,pt:3}}
          >
            <DatePicker
              label="Fecha Inicio"
              value={startDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              defaultValue={null}
              format={formatStr.split.date}
              onChange={(newValue) => onChangeStartDate(newValue)}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <DatePicker
              label="Fecha Fin"
              value={endDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              defaultValue={null}
              format={formatStr.split.date}
              onChange={(newValue) => onChangeEndDate(newValue)}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={isError}
              onClick={handleBuscar}
              startIcon={<Iconify icon="mingcute:search-2-fill" />}
            >
              Consultar
            </Button>
          </Stack>
          <PreciosComprasDTQ params={paramsGetComprasProducto} />

        </Card>
      </Grid>

      <Grid item xs={12} md={4}>


        <TotalLineChart
          title="Variación de precios"
          subheader="anterior compra"
          config={configCharts}
          indexChart={0}
        />


        <Card sx={{ mt: 3 }}>
          <CardHeader title="Proveedores" />
          <UltimosPreciosCompras params={paramGetUltimosPreciosCompras} />
        </Card>
      </Grid>
    </Grid>


  );

}
