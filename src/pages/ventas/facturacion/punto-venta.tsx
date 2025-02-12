
import { Helmet } from 'react-helmet-async';

import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { PrintIcon } from 'src/core/components/icons/CommonIcons';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import CatalogoProductos from './sections/catalogo-productos';
// ----------------------------------------------------------------------
const metadata = {
  header: 'Punto de Venta',
  title: 'Punto de Venta',
  parent: { name: 'Ventas', href: paths.dashboard.ventas.facturacion.root },
};



export default function PuntoVentaPage() {



  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
        <CustomBreadcrumbs
          links={[
            metadata.parent,
            { name: `${metadata.title}` },
          ]}
          action={
            <LoadingButton
              loading={false}
              color="success"
              variant="contained"
              startIcon={<PrintIcon />}
            >
              Imprimir
            </LoadingButton>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <CatalogoProductos />
      </DashboardContent >
    </>
  );
}
