import { useMemo, useState, useCallback } from 'react';

// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

// functions
import { toTitleCase } from 'src/utils/string-util';

// api
import { useFindByUuid } from 'src/api/core';

// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// types
import { IFindByUuid } from 'src/types/core';

// tabs
import ProductoTrn from './producto-trn';
import ProductoForm from './producto-form';

// ----------------------------------------------------------------------
const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="icon-park-outline:id-card" width={24} />,
  },
  {
    value: 'transacciones',
    label: 'Transacciones',
    icon: <Iconify icon="icon-park-outline:view-list" width={24} />,
  },
  {
    value: 'precios',
    label: 'Ultimos Precios',
    icon: <Iconify icon="material-symbols:price-change-outline" width={24} />,
  },
  {
    value: 'archivos',
    label: 'Fotos - Archivos',
    icon: <Iconify icon="icon-park-outline:image-files" width={24} />,
  },
  {
    value: 'estadisticas',
    label: 'Estadisticas',
    icon: <Iconify icon="fluent-mdl2:b-i-dashboard" width={24} />,
  },
];

export default function ProductoEditView() {
  const settings = useSettingsContext();
  const params = useParams();

  const [currentTab, setCurrentTab] = useState('general');

  const { id } = params; // obtiene parametro id de la url

  const paramsFindByUuid: IFindByUuid = useMemo(() => ({
    tableName: 'inv_articulo',
    uuid: id || ''
  }), [id]);

  // Busca los datos por uuid
  const { dataResponse: currentProduct } = useFindByUuid(paramsFindByUuid);

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


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
          { name: toTitleCase(currentProduct?.nombre_inarti) },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'general' ? (<ProductoForm currentProducto={currentProduct} />) : null}
      {currentTab === 'transacciones' ? (<ProductoTrn currentProducto={currentProduct} />) : null}

    </Container>
  );
}
