
// @mui
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import ProductoForm from './producto-form';
// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function ProductoCreatePage() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title>Productos: Crear</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
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
