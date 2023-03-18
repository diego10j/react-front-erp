// @mui
import { Container, Button, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// hooks
import CalendarRangePicker, { useCalendarRangePicker } from '../../core/components/calendar';
import { DataTableQuery, useDataTableQuery } from '../../core/components/dataTable';
// sections
import { Block } from '../../sections/_examples/Block';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// util
import { getDateFormat, addDaysDate, fDate } from '../../utils/formatTime';
import { FORMAT_DATE_FRONT } from '../../config-global';
import { CustomColumn } from '../../core/components/dataTable/types';
import { Query } from '../../core/interface/query';


// sections

// ----------------------------------------------------------------------

export default function EventosAuditoria() {

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
      name: "ide_auac", label: "Código", order: 1
    },
    {
      name: "fecha_auac", label: "Fecha", order: 0, visible: false
    },
    {
      name: "id_session_auac", visible: false
    }
  ];

  const table = useDataTableQuery({ query, customColumns });



  return (
    <>
      <Helmet>
        <title> Consulta Eventos Auditoria Usuarios</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Consulta Eventos Auditoria Usuarios"
          links={[
            {
              name: 'Auditoria',
              href: PATH_DASHBOARD.auditoria.root,
            }
          ]}
        />
      </Container>

      <Block>
        <Button variant="contained" onClick={pickerInput.onOpen}>
          Click me!
        </Button>

        <Stack sx={{ typography: 'body2', mt: 3 }}>
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
      </Block>

      <DataTableQuery
        data={table.data}
        columns={table.columns}
        loading={table.loading}
        columnVisibility={table.columnVisibility}
      />
    </>
  );
}
