
import { Helmet } from 'react-helmet-async';

// @mui

// routes
import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

// components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoForm from './producto-form';

const metadata = { title: `Crear Producto` };
// ----------------------------------------------------------------------

export default function ProductoCreatePage() {
  return (
    <>
      <Helmet>
      <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Crear Producto"
          links={[
            {
              name: 'Productos',
              href: paths.dashboard.inventario.productos.root,
            },
            {
              name: 'Lista de Productos',
              href: paths.dashboard.inventario.productos.list,
            },
            { name: 'Nuevo Producto' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <ProductoForm />
      </DashboardContent>
    </>
  );
}
