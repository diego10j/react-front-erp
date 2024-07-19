import { Helmet } from 'react-helmet-async';

import { Card, Button, } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { AddIcon } from 'src/core/components/icons/CommonIcons';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UsuariosDTQ from './sections/usuario-dtq';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Usuarios',
  title: 'Listado de Usuarios',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
};


export default function UsuarioListPage() {

  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Lista de Usuarios"
          links={[
            metadata.parent,
            { name: `${metadata.title}` },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.sistema.usuarios.create}
              variant="contained"
              startIcon={<AddIcon />}
            >
              Nuevo Usuario
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <UsuariosDTQ />
        </Card>
      </DashboardContent >
    </>
  );
}
