import type { IDatePickerControl } from 'src/types/common';

import dayjs from 'dayjs';
import { Helmet } from 'react-helmet-async';
import { useState, useCallback } from "react";

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { formatStr, convertDayjsToDate } from "src/utils/format-time";

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetListDataBodegas } from 'src/api/inventario/bodegas';
import { DropdownMultiple, useDropdownMultiple } from 'src/core/components/dropdown';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { toNumberArray } from '../../../utils/array-util';
import StockProductosDTQ from './sections/stock-producto-dtq';
import { PrintIcon, SearchIcon } from '../../../core/components/icons/CommonIcons';

import type { IgetStockProductos } from '../../../types/inventario/bodegas';
// ----------------------------------------------------------------------

const metadata = {
  header: 'Stock de Productos',
  title: 'Stock Productos',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
};


export default function StockProductosPage() {

  const droBodegas = useDropdownMultiple({ config: useGetListDataBodegas() });

  const [date, setDate] = useState<IDatePickerControl>(dayjs(new Date()));

  const [params, setParams] = useState<IgetStockProductos>(
    {
      onlyStock: false,
      fechaCorte: convertDayjsToDate(date),
      ide_inbod: droBodegas.value ? toNumberArray(droBodegas.value) : undefined,
    }
  );

  const onChangeDate = useCallback((newValue: IDatePickerControl) => {
    setDate(newValue);
  }, []);


  const handleSearch = useCallback(() => {
    const ide_inbod = droBodegas?.value?.length ? toNumberArray(droBodegas.value) : undefined;
    setParams((prevParams) => ({
      ...prevParams,
      fechaCorte: convertDayjsToDate(date),
      ide_inbod,
    }));
  }, [date, droBodegas, setParams]);


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
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.inventario.bodegas.create}
              variant="outlined"
              startIcon={<PrintIcon />}
            >
              Imprimir
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ pt: 3, pb: 0, px: 2 }}>


          <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ py: 2 }}
          >
            <DatePicker
              label="Fecha Corte"
              value={date}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              defaultValue={null}
              format={formatStr.split.date}
              onChange={(newValue) => onChangeDate(newValue)}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <DropdownMultiple
              id="bodegas"
              label="Bodegas"
              showEmptyOption={false}
              useDropdownMultiple={droBodegas}
              placeholder="Todas las Bodegas"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ minWidth: 256 }}
              startIcon={<SearchIcon />}
            >
              Consultar
            </Button>
          </Stack>

          <StockProductosDTQ params={params} restHeight={390} />
        </Card>
      </DashboardContent>
    </>
  );
}
