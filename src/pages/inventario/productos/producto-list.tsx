import { Helmet } from 'react-helmet-async';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductosDTQ from './sections/producto-dtq';


// ----------------------------------------------------------------------
const metadata = {
  header: 'Listado de Productos',
  title: 'Productos',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
};


export default function ProductoListPage() {

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
              href={paths.dashboard.inventario.productos.create}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Nuevo Producto
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ pt: 3, pb: 0, px: 2 }}>
          <ProductosDTQ />
        </Card>
      </DashboardContent>
    </>
  );
}
