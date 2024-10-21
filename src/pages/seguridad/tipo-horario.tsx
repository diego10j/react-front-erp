import { Helmet } from 'react-helmet-async';

import { Card, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import TipoHorarioDTQ from './sections/tipo-horario-dtq';



// ----------------------------------------------------------------------
const metadata = {
  header: 'Gestión de Tipos de Horarios',
  title: 'Tipos de Horarios',
  parent: { name: 'Seguridad', href: paths.dashboard.seguridad.root },
};


export default function TipoHorarioPage() {

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
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
          <Card>
            <TipoHorarioDTQ />
          </Card>
        </Stack>
      </DashboardContent >

    </>
  );
}
