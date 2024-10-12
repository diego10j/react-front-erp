import { Helmet } from 'react-helmet-async';

import { Card, Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetListDataCategorias } from 'src/api/inventario/productos';
import { DropdownMultiple, useDropdownMultiple } from 'src/core/components/dropdown';
import { useGetListDataBodegas, useGetListDataDetalleStock } from 'src/api/inventario/bodegas';

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

  const droBodegas = useDropdownMultiple({ config: useGetListDataBodegas() });
  const droStock = useDropdownMultiple({ config: useGetListDataDetalleStock() });
  const droCategorias = useDropdownMultiple({ config: useGetListDataCategorias() });




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


          <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ py: 2 }}
          >
            <DropdownMultiple
              id="bodegas"
              label="Bodegas"
              showEmptyOption={false}
              useDropdownMultiple={droBodegas}
            />
            <DropdownMultiple
              id="categorias"
              label="Categorías"
              showEmptyOption={false}
              useDropdownMultiple={droCategorias}
            />
            <DropdownMultiple
              id="stock"
              label="Stock"
              showEmptyOption={false}
              useDropdownMultiple={droStock}
            />
          </Stack>

          <StockProductosDTQ restHeight={390} />
        </Card>
      </DashboardContent>
    </>
  );
}
