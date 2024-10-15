import dayjs from 'dayjs';
import { useState, useCallback } from "react";
import { Helmet } from 'react-helmet-async';

import { DatePicker } from "@mui/x-date-pickers";
import { Card, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { DropdownMultiple, useDropdownMultiple } from 'src/core/components/dropdown';
import { useGetListDataBodegas } from 'src/api/inventario/bodegas';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StockProductosDTQ from './sections/stock-producto-dtq';
import { PrintIcon, SearchIcon } from '../../../core/components/icons/CommonIcons';

import type { IDatePickerControl } from 'src/types/common';
import { formatStr } from "src/utils/format-time";
import { IgetStockProductos } from '../../../types/inventario/bodegas';
import { convertDayjsToDate } from '../../../utils/format-time';
import { toNumberArray } from '../../../utils/array-util';
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
      fechaCorte: convertDayjsToDate(date),
      ide_inbod: toNumberArray(droBodegas.value || []),
    }
  );


  const onChangeDate = useCallback((newValue: IDatePickerControl) => {
    setDate(newValue);
  }, []);




  const handleSearch = () => {
    setParams({
      ...params,
      fechaCorte: convertDayjsToDate(date),
      ide_inbod: toNumberArray(droBodegas.value || []),
    });
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
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
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
