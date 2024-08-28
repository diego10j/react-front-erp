
import dayjs from 'dayjs';
import { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button } from '@mui/material';

import { formatStr, addDaysDate, convertDayjsToDate } from "src/utils/format-time";

import { useCalendarRangePicker } from "src/core/components/calendar";

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import TransaccionesProductoDTQ from './sections/transacciones-dtq';

import type { IgetTrnProducto } from '../../../types/inventario/productos';


type Props = {
  currentProducto: {
    ide_inarti: string;
    nombre_inarti: string;
  };
};
export default function ProductoTrn({ currentProducto }: Props) {

  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -365)), dayjs(new Date()));

  const [paramsGetTrnProducto, setParamsGetTrnProducto] = useState<IgetTrnProducto>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
      ide_inarti: Number(currentProducto.ide_inarti)
    }
  );


  const handleBuscar = () => {
    if (!isError) {
      setParamsGetTrnProducto({
        ...paramsGetTrnProducto,
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
      });
    } else {
      toast.warning('Fechas no válidas');
    }
  };

  return (
    <Card sx={{ pt: 3, pb: 0, px: 2 }}>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
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
      <TransaccionesProductoDTQ params={paramsGetTrnProducto} />

    </Card>
  );

}
