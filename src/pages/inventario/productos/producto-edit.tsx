import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useFormTable } from 'src/core/components/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTableQueryProductoByUuid } from 'src/api/inventario/productos';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

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
            mb: 0,
          }}
        />

        <ProductoFRT useFormTable={frmTable} />
      </DashboardContent>
    </>
  );
}
