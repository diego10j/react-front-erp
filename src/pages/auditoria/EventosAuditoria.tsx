// @mui
import { Container, Button, Stack, Card, Paper } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// hooks
import { LoadingButton } from '@mui/lab';
import CalendarRangePicker, { useCalendarRangePicker } from '../../core/components/calendar';
import Dropdown, { useDropdown } from '../../core/components/dropdown';
import { DataTableQuery, useDataTableQuery } from '../../core/components/dataTable';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings/SettingsContext';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// util
import { getDateFormat, addDaysDate } from '../../utils/formatTime';
import { CustomColumn } from '../../core/components/dataTable/types';
import { Query } from '../../core/interface/query';

// sections

// ----------------------------------------------------------------------

export default function EventosAuditoria() {

  const { themeStretch } = useSettingsContext();

  const calDates = useCalendarRangePicker((addDaysDate(new Date(), -3)), new Date());

  const droUser = useDropdown({ config: { tableName: 'sis_usuario', primaryKey: 'ide_usua', columnLabel: 'nom_usua' } });

  const query: Query = {
    serviceName: 'api/audit/getEventosAuditoria',
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
      name: 'fecha_auac', label: 'Fecha', order: 1, filter: false
    },
    {
      name: 'detallE_auac', label: 'Referencia', orderable: false

    },
    {
      name: 'pantalla', size: 250

    }
  ];

  const table = useDataTableQuery({ query, customColumns });

  const handleDeleteAudit = () => {
    console.log(table.selected);

  };

  const handleSearch = () => {
    query.params.fechaInicio = getDateFormat(calDates.startDate);
    query.params.fechaFin = getDateFormat(calDates.endDate);
    query.params.ide_usua = droUser.value === null ? null : Number(droUser.value);
    table.onRefresh();
  };

  return (
    <>
      <Helmet>
        <title>Eventos Auditoria Usuarios</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading='Eventos Auditoria Usuarios'
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Auditoria',
              href: PATH_DASHBOARD.auditoria.root,
            }
          ]}
          action={
            <Button
              onClick={handleDeleteAudit}
              color="error"
              variant="contained"
              startIcon={<Iconify icon="ic:twotone-delete-outline" />}
            >
              {table.selectionMode === 'multiple' ? 'Eliminar Seleccionados' : 'Borrar Auditoria'}
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
          sx={{ px: 2.5, py: 3, border: 'radius' }}
        >

          <CalendarRangePicker
            label={calDates.label}
            startDate={calDates.startDate}
            endDate={calDates.endDate}
            maxStartDate={new Date()}
            maxEndDate={new Date()}
            onChangeStartDate={calDates.onChangeStartDate}
            onChangeEndDate={calDates.onChangeEndDate}

            isError={calDates.isError}
          />

          <Dropdown
            label="Usuario"
            options={droUser.options}
            value={droUser.value}
            selectionMode={droUser.selectionMode}
            loading={droUser.loading}
            setValue={droUser.setValue}
          />

          <LoadingButton
            loading={table.loading}
            variant="contained"
            onClick={handleSearch}
            endIcon={<Iconify icon="ic:baseline-search" />}
            fullWidth
          >
            Buscar
          </LoadingButton>

        </Stack>



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
