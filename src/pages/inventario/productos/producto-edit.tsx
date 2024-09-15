import type { IFindByUuid } from 'src/types/core';

import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useFindByUuid } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';
import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoForm from './producto-form';

// ----------------------------------------------------------------------

const metadata = { title: `Editar Producto` };

export default function ProductoEditView() {

  const params = useParams();

  const { id } = params; // obtiene parametro id de la url

  const paramsFindByUuid: IFindByUuid = useMemo(() => ({
    tableName: 'inv_articulo',
    uuid: id || ''
  }), [id]);

  // Busca los datos por uuid
  const { dataResponse: currentProduct } = useFindByUuid(paramsFindByUuid);

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
              name: currentProduct.nombre_inarti,
              href: paths.dashboard.inventario.productos.details(currentProduct?.uuid)
            },
          ]}
          activeLast
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <ProductoForm currentProducto={currentProduct} />
      </DashboardContent>
    </>
  );
}
