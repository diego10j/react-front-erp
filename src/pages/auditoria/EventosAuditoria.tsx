// @mui
import { Container, Button, Stack, Card } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// hooks
import CalendarRangePicker, { useCalendarRangePicker } from '../../core/components/calendar';
import { DataTableQuery, useDataTableQuery } from '../../core/components/dataTable';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings/SettingsContext';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// util
import { getDateFormat, addDaysDate, fDate } from '../../utils/formatTime';
import { FORMAT_DATE_FRONT } from '../../config-global';
import { CustomColumn } from '../../core/components/dataTable/types';
import { Query } from '../../core/interface/query';



// sections

// ----------------------------------------------------------------------

export default function EventosAuditoria() {

  const { themeStretch } = useSettingsContext();

  const pickerInput = useCalendarRangePicker((addDaysDate(new Date(), -3)), new Date());

  const query: Query = {
    serviceName: 'api/audit/eventos-auditoria',
    params: {
      // initial values
      fechaInicio: getDateFormat(addDaysDate(new Date(), -3)),
      fechaFin: getDateFormat(new Date()),
      ide_usua: null
    }
  };

  // personaliza Columnas
  const customColumns: CustomColumn[] = [
    {
      name: 'ide_auac', visible: false
    },
    {
      name: 'fecha_auac', label: 'Fecha', order: 1
    },
    {
      name: 'id_session_auac', label: 'Referencia'

    },
    {
      name: 'pantalla', size: 250

    }
  ];

  const table = useDataTableQuery({ query, customColumns });

  const handleRemoveAudit = () => {
    console.log(table.selected);
  };

  return (
    <>
      <Helmet>
        <title> Consulta Eventos Auditoria Usuarios</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Consulta Eventos Auditoria Usuarios'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Auditoria',
              href: PATH_DASHBOARD.auditoria.root,
            }
          ]}
          action={
            <Button
              onClick={handleRemoveAudit}
              color="error"
              variant="contained"
              startIcon={<Iconify icon="eva:plus-remove" />}
            >
              Borrar Auditoria
            </Button>
          }
        />
      </Container>

      <Card>
        <Stack
          spacing={2}
          alignItems='center'
          direction={{
            xs: 'column',
            md: 'row',
          }}
          sx={{ px: 2.5, py: 3 }}
        >
          <Button variant='contained' onClick={pickerInput.onOpen}>
            Click me!
          </Button>
          <div>
            <strong>Start:</strong> {fDate(pickerInput.startDate, FORMAT_DATE_FRONT)}
          </div>
          <div>
            <strong>End:</strong> {fDate(pickerInput.endDate, FORMAT_DATE_FRONT)}
          </div>
        </Stack>

        <CalendarRangePicker
          open={pickerInput.open}
          startDate={pickerInput.startDate}
          endDate={pickerInput.endDate}
          maxStartDate={new Date()}
          maxEndDate={new Date()}
          onChangeStartDate={pickerInput.onChangeStartDate}
          onChangeEndDate={pickerInput.onChangeEndDate}
          onClose={pickerInput.onClose}
          isError={pickerInput.isError}
        />


        <DataTableQuery
          data={table.data}
          columns={table.columns}
          rows={50}
          loading={table.loading}
          columnVisibility={table.columnVisibility}
          defaultOrderBy='fecha_auac'
          numSkeletonCols={7}
          selectionMode={table.selectionMode}
          selected={table.selected}
          onRefresh={table.onRefresh}
          onSelectRow={table.onSelectRow}
          onSelectAllRows={table.onSelectAllRows}
          onSelectionModeChange={table.onSelectionModeChange}
        />
      </Card>
    </>
  );
}
