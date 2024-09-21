
import dayjs from 'dayjs';
import { useState, useCallback } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button, TextField, InputAdornment } from '@mui/material';

import { formatStr, addDaysDate, convertDayjsToDate } from "src/utils/format-time";

import { useCalendarRangePicker } from "src/core/components/calendar";

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import PreciosVentasDTQ from './sections/precios-ventas-dtq';

import type { IgetVentasProducto } from '../../../types/inventario/productos';



type Props = {
  currentProducto: {
    ide_inarti: string;
    nombre_inarti: string;
    siglas_inuni: string;
  };
};
export default function ProductoPreciosVentas({ currentProducto }: Props) {

  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -180)), dayjs(new Date()));

  const [paramsGetVentasProducto, setParamsGetVentasProducto] = useState<IgetVentasProducto>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
      ide_inarti: Number(currentProducto.ide_inarti)
    }
  );

  const [cantidad, setCantidad] = useState<number | undefined>();

  const handleChangeCantidad = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(Number(event.target.value) || undefined);
  }, []);

  const handleBuscar = useCallback(() => {
    if (!isError) {
      setParamsGetVentasProducto(prevState => ({
        ...prevState,
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
        cantidad,
      }));
    } else {
      toast.warning('Fechas no válidas');
    }
  }, [isError, startDate, endDate, cantidad, setParamsGetVentasProducto]);



  return (
    <Card sx={{ pt: 3, pb: 0, px: 2 }}>



      <Stack
        spacing={2}
        width="100%"
        justifyContent="center"
        alignItems="center"  // Centrará el contenido verticalmente
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{ pb: 2 }}
      >
        <TextField
          size="small"
          type="number"
          placeholder="Cantidad a buscar"
          value={cantidad || ''}
          sx={{ maxWidth: 180 }}
          onChange={handleChangeCantidad}
          label="Cantidad"
          InputProps={{ endAdornment: <InputAdornment position="end">{currentProducto.siglas_inuni}</InputAdornment> }}
        />
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

      <PreciosVentasDTQ params={paramsGetVentasProducto} />


    </Card>
  );

}
