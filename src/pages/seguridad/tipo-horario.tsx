import { Helmet } from 'react-helmet-async';

import { Card, } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';



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
        <Card>
          <div>Aqui </div>
        </Card>
      </DashboardContent >
    </>
  );
}
