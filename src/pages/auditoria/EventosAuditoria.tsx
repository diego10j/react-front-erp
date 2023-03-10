// @mui
import { Container, Box, Button, Stack, Link } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// hooks
import DateRangePicker, { useDateRangePicker } from '../../components/date-range-picker';
// sections
import { Block } from '../../sections/_examples/Block';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import DataTableQuery from '../../components/core/dataTable/DataTableQuery';
// util
import { getDateFormat, addDaysDate, fDate } from '../../utils/formatTime';
import { FORMAT_DATE_FRONT } from '../../config-global';


// sections

// ----------------------------------------------------------------------

export default function EventosAuditoria() {

  const pickerInput = useDateRangePicker(new Date(), new Date());

  // Parametros iniciales del servicio
  const params = {
    fecha_inicio: getDateFormat(addDaysDate(new Date(), -3)),
    fecha_fin: getDateFormat(new Date()),
    ide_usua: null
  };


  return (
    <>
      <Helmet>
        <title> Consulta Eventos Auditoria Usuarios</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Auditoria"
          links={[
            {
              name: 'Consulta Eventos Auditoria Usuarios',
              href: PATH_DASHBOARD.auditoria.root,
            },
            { name: 'Consulta  Eventos Auditoria Usuarios' },
          ]}
        />
      </Container>

      <Block title="Input">
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

        <DateRangePicker
          open={pickerInput.open}
          startDate={pickerInput.startDate}
          endDate={pickerInput.endDate}
          onChangeStartDate={pickerInput.onChangeStartDate}
          onChangeEndDate={pickerInput.onChangeEndDate}
          onClose={pickerInput.onClose}
          isError={pickerInput.isError}
        />
      </Block>

      <DataTableQuery isNotFound />
    </>
  );
}
