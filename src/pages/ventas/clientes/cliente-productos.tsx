

import type { IgetTrnCliente } from "src/types/ventas/clientes";

import dayjs from "dayjs";
import { toast } from "sonner";
import { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Grid, Stack, Button, CardHeader } from "@mui/material";

import { formatStr, addDaysDate, convertDayjsToDate } from "src/utils/format-time";

import { useCalendarRangePicker } from "src/core/components/calendar";

import { Iconify } from "src/components/iconify";

import ClientesVentasDTQ from "./sections/cliente-ventas-dtq";
import ClienteListaProductos from "./sections/cliente-list-productos";




// ----------------------------------------------------------------------
type Props = {
  currentCliente: any;
};

export default function ClienteProductos({ currentCliente }: Props) {


  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -180)), dayjs(new Date()));

  const [paramsGetTrnCliente, setParamsGetTrnCliente] = useState<IgetTrnCliente>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
      ide_geper: Number(currentCliente.ide_geper)
    }
  );


  const handleBuscar = () => {
    if (!isError) {
      setParamsGetTrnCliente({
        ...paramsGetTrnCliente,
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
            sx={{ p: 2, pt: 3 }}
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
          <ClientesVentasDTQ params={paramsGetTrnCliente} />

        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ mt: 3 }}>
          <CardHeader title="Productos" />
          <ClienteListaProductos params={{ ide_geper: Number(currentCliente.ide_geper) }} />
        </Card>
      </Grid>
    </Grid>


  );

}
