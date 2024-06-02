import { useSnackbar } from "notistack";
import { useMemo, useState } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button, Tooltip, Skeleton, CardHeader, Typography } from '@mui/material';

import { toTitleCase } from "src/utils/string-util";
import { addDaysDate, getCurrentDate } from "src/utils/format-time";

import { useGetSaldo } from "src/api/productos";
import { useCalendarRangePicker } from "src/core/components/calendar";

import Iconify from "src/components/iconify";

import Label from '../../components/label/label';
import { IgetSaldo, IgetTrnProducto } from '../../types/productos';
import TransaccionesProductoDTQ from './dataTables/transacciones-dtq';


type Props = {
  currentProducto: {
    ide_inarti: string;
    nombre_inarti: string;
  };
};
export default function ProductoTrn({ currentProducto }: Props) {

  const { enqueueSnackbar } = useSnackbar();
  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker((addDaysDate(getCurrentDate(), -365)), getCurrentDate());

  const paramGetSaldo: IgetSaldo = useMemo(() => (
    { ide_inarti: Number(currentProducto.ide_inarti) }
  ), [currentProducto]);
  const { dataResponse, isLoading } = useGetSaldo(paramGetSaldo);

  const [paramsGetTrnProducto, setParamsGetTrnProducto] = useState<IgetTrnProducto>(
    {
      fechaInicio: startDate,
      fechaFin: endDate,
      ide_inarti: Number(currentProducto.ide_inarti)
    }
  );


  const handleBuscar = () => {
    if (!isError) {
      setParamsGetTrnProducto({
        ...paramsGetTrnProducto,
        fechaInicio: startDate,
        fechaFin: endDate,
      });
    } else {
      enqueueSnackbar('Fechas no válidas', { variant: 'warning' });
    }
  };

  return (
    <Card>
      <CardHeader title={toTitleCase(currentProducto.nombre_inarti)} sx={{ mb: 1 }}
        action={
          <Tooltip title="Existencia">
            {isLoading === true ? (
              <Skeleton variant="rounded" width={135} height={36} />
            ) : (
              <Label variant="soft" color="info" sx={{ ml: 2 }}> <Typography variant="h5" sx={{ pr: 2 }}> {dataResponse.rows[0].saldo} {dataResponse.rows[0].siglas_inuni} </Typography> </Label>
            )}
          </Tooltip>
        }
      />
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <DatePicker
          label="Fecha Desde"
          value={startDate}
          slotProps={{ textField: { fullWidth: true } }}
          onChange={(newValue) => onChangeStartDate(newValue)}
          sx={{
            maxWidth: { md: 180 },
          }}
        />
        <DatePicker
          label="Fecha Hasta"
          value={endDate}
          onChange={(newValue) => onChangeEndDate(newValue)}
          slotProps={{ textField: { fullWidth: true } }}
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
          Buscar
        </Button>
      </Stack>
      <TransaccionesProductoDTQ params={paramsGetTrnProducto} />

    </Card>
  );

}
