import { Helmet } from 'react-helmet-async';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import BodegasDTQ from './sections/bodegas-dtq';

import { SaveIcon } from '../../../core/components/icons/CommonIcons';

// ----------------------------------------------------------------------

const metadata = {
  header: 'Bodegas',
  title: 'Listado de Bodegas',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
};


export default function BodegasListPage() {


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
              startIcon={<SaveIcon />}
            >
              Nueva Bodega
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ pt: 3, pb: 0, px: 2 }}>
          <BodegasDTQ />
        </Card>
      </DashboardContent>
    </>
  );
}
