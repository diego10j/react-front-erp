import type { IUuid } from 'src/types/core';
import type { IgetSaldo } from 'src/types/inventario/productos';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import Skeleton from '@mui/material/Skeleton';
import { Tab, Box, Tabs, Stack, Avatar, Tooltip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { getUrlImagen } from 'src/api/sistema/files';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetSaldo, useGetProducto } from 'src/api/inventario/productos';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ProductoTrn from './producto-trn';
import ProductoFiles from './producto-files';
import ProductoGraficos from './producto-grafico';
import ProductoCard from './sections/producto-card';
import ProductoPreciosCompras from './producto-precios';
import ProductoPreciosVentas from './producto-precios-venta';


// ----------------------------------------------------------------------
const TABS = [
  {
    value: 'general',
    label: 'Producto',
    icon: <Iconify icon="lucide:package-check" width={24} />
  },
  {
    value: 'transacciones',
    label: 'Transacciones',
    icon: <Iconify icon="fluent:table-calculator-20-regular" width={24} />
  },
  {
    value: 'preciosc',
    label: 'Precios Compras',
    icon: <Iconify icon="fluent:money-calculator-24-regular" width={24} />
  },
  {
    value: 'preciosv',
    label: 'Precios Ventas',
    icon: <Iconify icon="fluent:people-money-24-regular" width={24} />
  },
  {
    value: 'archivos',
    label: 'Archivos',
    icon: <Iconify icon="solar:flash-drive-linear" width={24} />
  },
  {
    value: 'estadisticas',
    label: 'Tablero',
    icon: <Iconify icon="carbon:dashboard-reference" width={24} />
  },
];


const metadata = { title: `Detalles del Producto` };

export default function ProductoDetailsPage() {

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  const params = useParams();

  const { id } = params; // obtiene parametro id de la url

  const paramsUuid: IUuid = useMemo(() => ({
    uuid: id || ''
  }), [id]);

  // Busca los datos por uuid
  const { dataResponse: dataResponseProd, isLoading: isLoadingProd } = useGetProducto(paramsUuid);

  const currentProduct = useMemo(() => dataResponseProd?.row?.producto || {}, [dataResponseProd]);

  const paramGetSaldo: IgetSaldo = useMemo(() => (
    { ide_inarti: Number(currentProduct?.ide_inarti || 0) }
  ), [currentProduct]);
  const { dataResponse, isLoading } = useGetSaldo(paramGetSaldo);


  const renderTabContent = useCallback(() => {
    if (isLoadingProd) return null;
    switch (currentTab) {
      case 'general':
        return <ProductoCard data={dataResponseProd.row} />;
      case 'transacciones':
        return <ProductoTrn currentProducto={currentProduct} />;
      case 'preciosc':
        return <ProductoPreciosCompras currentProducto={currentProduct} />;
      case 'preciosv':
        return <ProductoPreciosVentas currentProducto={currentProduct} />;
      case 'archivos':
        return <ProductoFiles currentProducto={currentProduct} />;
      case 'estadisticas':
        return <ProductoGraficos currentProducto={currentProduct} />;
      default:
        return null;
    }
  }, [currentTab, isLoadingProd, dataResponseProd, currentProduct]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Detalles del Producto"
          links={[
            {
              name: 'Lista de Productos',
              href: paths.dashboard.inventario.productos.list,
            },
            { name: currentProduct.nombre_inarti },
          ]}
          sx={{
            mb: 2,
          }}
        />



        <Stack
          spacing={1.5}
          direction="row"
          alignItems="center"
          sx={{
            mb: 1,
          }}
        >

          <Box sx={{ flexGrow: 1 }} >
            <Stack direction="row" spacing={1}>
              <Avatar
                alt={currentProduct.nombre_inarti}
                src={getUrlImagen(currentProduct.foto_inarti)}
                variant="square"
                sx={{ width: 64, height: 64 }}
              />
              <Stack direction="column">
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  PRD-00001
                </Typography>
                <Typography variant="subtitle1">{currentProduct.nombre_inarti}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Tooltip title="Existencia">
            {isLoading ? (
              <Skeleton variant="rounded" width={135} height={36} />
            ) : (
              <Label variant="soft" sx={{ ml: 2, color: 'primary.main' }}>
                <Typography variant="h4" sx={{ pr: 2 }}>
                  {dataResponse?.rowCount === 0
                    ? '0.00'
                    : `${dataResponse?.rows?.[0]?.saldo ?? '0.00'} ${dataResponse?.rows?.[0]?.siglas_inuni ?? ''}`}
                </Typography>
              </Label>
            )}
          </Tooltip>


        </Stack>


        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>


        {renderTabContent()}


      </DashboardContent>
    </>
  );
}
