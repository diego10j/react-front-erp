import { useState, useEffect } from 'react';

// @mui
import Container from '@mui/material/Container';

// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductoForm from './producto-form';
import { useFindByUuid } from '../../api/core';
// import { findByUuid } from '../../services/core/serviceSistema';

// ----------------------------------------------------------------------

export default function ProductoEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const [currentProduct, setCurrentProduct] = useState<any>({});

  const { id } = params;

  const { dataResponse } = useFindByUuid('inv_articulo', id || '');


  useEffect(() => {
    if (dataResponse) {
      setCurrentProduct(dataResponse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataResponse]);



  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Modificar Producto"
        links={[
          {
            name: 'Productos',
            href: paths.dashboard.productos.root,
          },
          {
            name: 'Lista de Productos',
            href: paths.dashboard.productos.list,
          },
          { name: currentProduct?.nombre_inarti },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductoForm currentProducto={currentProduct} />

    </Container>
  );
}
