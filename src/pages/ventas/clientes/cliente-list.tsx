import { Helmet } from 'react-helmet-async';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { CreateIcon } from 'src/core/components/icons/CommonIcons';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ClienteDTQ from './sections/cliente-dtq';


// ----------------------------------------------------------------------
const metadata = {
  header: 'Listado de Clientes',
  title: 'Clientes',
  parent: { name: 'Ventas', href: paths.dashboard.ventas.root },
};


export default function ClienteListPage() {

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
              href={paths.dashboard.ventas.clientes.create}
              variant="contained"
              startIcon={<CreateIcon />}
            >
              Nuevo Cliente
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ pt: 3, pb: 0, px: 2 }}>
          <ClienteDTQ />
        </Card>
      </DashboardContent>
    </>
  );
}
