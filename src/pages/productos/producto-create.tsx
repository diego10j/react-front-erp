
import { Helmet } from 'react-helmet-async';

// @mui
import { Container } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoForm from './producto-form';


// ----------------------------------------------------------------------

export default function ProductoCreatePage() {
  return (
    <>
      <Helmet>
        <title>Productos: Crear</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Crear Producto"
          links={[
            {
              name: 'Productos',
              href: paths.dashboard.productos.root,
            },
            {
              name: 'Lista de Productos',
              href: paths.dashboard.productos.list,
            },
            { name: 'Nuevo Producto' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <ProductoForm />
      </Container>
    </>
  );
}
