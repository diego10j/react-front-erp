import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';


import { DashboardContent } from 'src/layouts/dashboard';
import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';


import { useFormTable } from 'src/core/components/form';
import { useGetTableQueryProductoByUuid } from 'src/api/inventario/productos';
import ProductoFRT from './sections/producto-frt';

// ----------------------------------------------------------------------

const metadata = { title: `Editar Producto` };


export default function ProductoEditView() {

  const params = useParams();

  const { id } = params; // obtiene parametro id de la url


  const frmTable = useFormTable({ config: useGetTableQueryProductoByUuid(id) });

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <MenuToolbar
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <CustomBreadcrumbs
          heading="Editar Producto"
          links={[
            {
              name: 'Lista de Productos',
              href: paths.dashboard.inventario.productos.list,
            },
            {
              name: frmTable.getValue('nombre_inarti') || '',
              href: paths.dashboard.inventario.productos.details(id || '')
            },
          ]}
          activeLast
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ProductoFRT useFormTable={frmTable} />
      </DashboardContent>
    </>
  );
}
