
import type { IgetTrnCliente } from 'src/types/ventas/clientes';

import dayjs from 'dayjs';
import { useState } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button } from '@mui/material';

import { formatStr, addDaysDate, convertDayjsToDate } from "src/utils/format-time";

import { SearchIcon } from 'src/core/components/icons/CommonIcons';
import { useCalendarRangePicker } from "src/core/components/calendar";

import { toast } from 'src/components/snackbar';

import TransaccionesClienteDTQ from './sections/transacciones-dtq';



type Props = {
  currentCliente: {
    ide_geper: string;
    nom_geper: string;
  };
};
export default function ClienteTrn({ currentCliente }: Props) {

  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -365)), dayjs(new Date()));

  const [paramsGetTrn, setParamsGetTrn] = useState<IgetTrnCliente>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
      ide_geper: Number(currentCliente.ide_geper)
    }
  );


  const handleBuscar = () => {
    if (!isError) {
      setParamsGetTrn({
        ...paramsGetTrn,
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
      });
    } else {
      toast.warning('Fechas no válidas');
    }
  };

  return (
    <Card >
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
          startIcon={<SearchIcon/>}
        >
          Consultar
        </Button>
      </Stack>
      <TransaccionesClienteDTQ params={paramsGetTrn} />

    </Card>
  );

}
