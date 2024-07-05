import { Helmet } from 'react-helmet-async';

import { Card, Button, } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UsuariosDTQ from './sections/usuario-dtq';

// ----------------------------------------------------------------------
const metadata = { title: `Listado de Usuarios` };

export default function UsuarioListPage() {

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Lista de Usuarios"
          links={[
            {
              name: 'Usuarios',
              href: paths.dashboard.sistema.usuarios.root,
            },
            { name: 'Lista de Usuarios' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.sistema.usuarios.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
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
