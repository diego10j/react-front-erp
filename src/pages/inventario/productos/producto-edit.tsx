import type { IFindByUuid } from 'src/types/core';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import { Tab, Tabs, Card } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';
import { useFindByUuid } from 'src/api/core';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoTrn from './producto-trn';
import ProductoForm from './producto-form';
import ProductoFiles from './producto-files';
import ProductoPrecios from './producto-precios';
import ProductoGraficos from './producto-grafico';

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
    label: 'Archivos',
    icon: <Iconify icon="material-symbols:folder-data-outline" width={24} />,
  },
  {
    value: 'estadisticas',
    label: 'Estadisticas',
    icon: <Iconify icon="fluent-mdl2:b-i-dashboard" width={24} />,
  },
];

const metadata = { title: `Editar Producto` };

export default function ProductoEditView() {

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
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Modificar Producto"
          links={[
            {
              name: 'Inventario',
              href: paths.dashboard.inventario.productos.root,
            },
            {
              name: 'Lista de Productos',
              href: paths.dashboard.inventario.productos.list,
            },
            { name: (currentProduct?.nombre_inarti) },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card sx={{
          mb: { xs: 3, md: 5 },
        }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>
        </Card>
        {currentTab === 'general' ? (<ProductoForm currentProducto={currentProduct} />) : null}
        {currentTab === 'transacciones' ? (<ProductoTrn currentProducto={currentProduct} />) : null}
        {currentTab === 'precios' ? (<ProductoPrecios currentProducto={currentProduct} />) : null}
        {currentTab === 'archivos' ? (<ProductoFiles currentProducto={currentProduct} />) : null}
        {currentTab === 'estadisticas' ? (<ProductoGraficos currentProducto={currentProduct} />) : null}
      </DashboardContent>
    </>
  );
}
