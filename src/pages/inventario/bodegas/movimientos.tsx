import type { IgetMovimientos } from 'src/types/inventario/bodegas';

import dayjs from 'dayjs';
import { useState } from "react";
import { Helmet } from 'react-helmet-async';

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { formatStr, addDaysDate, convertDayjsToDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetListDataBodegas } from 'src/api/inventario/bodegas';
import Dropdown, { useDropdown } from 'src/core/components/dropdown';
import { useCalendarRangePicker } from 'src/core/components/calendar';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import MovimientosInventarioDTQ from './sections/movimientos-inv-dtq';

// ----------------------------------------------------------------------

const metadata = {
  header: 'Movimientos de Bodegas',
  title: 'Movimientos',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
};


export default function MovimientosBodegaPage() {

  const { startDate, onChangeStartDate, endDate, onChangeEndDate, isError } = useCalendarRangePicker(dayjs(addDaysDate(new Date(), -365)), dayjs(new Date()));
  const droBodegas = useDropdown({ config: useGetListDataBodegas() });

  const [paramsGetMovimientos, setParamsGetMovimientos] = useState<IgetMovimientos>(
    {
      fechaInicio: convertDayjsToDate(startDate),
      fechaFin: convertDayjsToDate(endDate),
    }
  );


  const handleBuscar = () => {
    if (!isError) {
      setParamsGetMovimientos({
        ...paramsGetMovimientos,
        fechaInicio: convertDayjsToDate(startDate),
        fechaFin: convertDayjsToDate(endDate),
        ide_inbod: droBodegas.value ? Number(droBodegas.value) : undefined
      });
    } else {
      toast.warning('Fechas no válidas');
    }
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={metadata.header}
          links={[
            metadata.parent,
            { name: `${metadata.title}` },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
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
            <Stack sx={{
              width: { md: 300, xs: '100%' },
            }}>
              <Dropdown
                label="Bodega"
                showEmptyOption
                emptyLabel="(TODAS LAS BODEGAS)"
                useDropdown={droBodegas}
              />
            </Stack>
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
          <MovimientosInventarioDTQ params={paramsGetMovimientos} restHeight={390} />
        </Card>
      </DashboardContent>
    </>
  );
}
