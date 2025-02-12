
import { Helmet } from 'react-helmet-async';

// @mui

// routes
import { paths } from 'src/routes/paths';

import { useFormTable } from 'src/core/components/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTableQueryProductoByUuid } from 'src/api/inventario/productos';

// components
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoFRT from './sections/producto-frt';

const metadata = { title: `Crear Producto` };
// ----------------------------------------------------------------------

export default function ProductoCreatePage() {

  const frmTable = useFormTable({ config: useGetTableQueryProductoByUuid() });

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
              name: 'Lista de Productos',
              href: paths.dashboard.inventario.productos.list,
            },
            { name: 'Nuevo Producto' },
          ]}
          sx={{
            mb: 0,
          }}
        />
         <ProductoFRT useFormTable={frmTable} />
      </DashboardContent>
    </>
  );
}
