
import { Helmet } from 'react-helmet-async';

import { Card } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// ----------------------------------------------------------------------
const metadata = {
  header: 'Listado de Facturas',
  title: 'Facturas',
  parent: { name: 'Ventas', href: paths.dashboard.ventas.facturacion.root },
};


export default function FacturasListPage() {

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
        <Card sx={{ p: { xs: 3, md: 5 } }}>
          <div>Contenido</div>

        </Card>

      </DashboardContent >

    </>
  );
}
