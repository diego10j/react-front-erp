import { Helmet } from 'react-helmet-async';

import { Card, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import StockProductosDTQ from './sections/stock-producto-dtq';
import { PrintIcon } from '../../../core/components/icons/CommonIcons';


// ----------------------------------------------------------------------

const metadata = {
  header: 'Stock de Productos',
  title: 'Stock Productos',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
};


export default function StockProductosPage() {


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
              href={paths.dashboard.inventario.bodegas.create}
              variant="contained"
              startIcon={<PrintIcon />}
            >
              Imprimir
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{ pt: 3, pb: 0, px: 2 }}>
          <StockProductosDTQ restHeight={390} />
        </Card>
      </DashboardContent>
    </>
  );
}
