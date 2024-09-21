import type { IUuid } from 'src/types/core';
import type { IgetSaldo } from 'src/types/inventario/productos';

import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useCallback } from 'react';

import Skeleton from '@mui/material/Skeleton';
import { Tab, Box, Tabs, Card, Stack, Avatar, Tooltip, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';
import { getUrlImagen } from 'src/api/sistema/files';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetSaldo, useGetProducto } from 'src/api/inventario/productos';

import { Label } from 'src/components/label';
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
    label: 'Producto'
  },
  {
    value: 'transacciones',
    label: 'Transacciones'
  },
  {
    value: 'preciosc',
    label: 'Precios Compras'
  },
  {
    value: 'preciosv',
    label: 'Precios Ventas'
  },
  {
    value: 'archivos',
    label: 'Documentos'
  },
  {
    value: 'estadisticas',
    label: 'Estadisticas'
  },
];


// <Tab label="Producto" />
// <Tab label="Precios de venta" />
// <Tab label="Precios de compra" />
// <Tab label="Movimientos" />
// <Tab label="Estadísticas" />
// <Tab label="Márgenes" />
// <Tab label="Notas" />
// <Tab label="Documentos" />
// <Tab label="Eventos" />


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
  const { dataResponse: dataResponseProd } = useGetProducto(paramsUuid);


  const hasData = dataResponseProd && dataResponseProd.row;

  const currentProduct = useMemo(() => hasData ? dataResponseProd.row.producto : {}, [hasData, dataResponseProd]);

  const paramGetSaldo: IgetSaldo = useMemo(() => (
    { ide_inarti: Number(currentProduct?.ide_inarti || 0) }
  ), [currentProduct]);
  const { dataResponse, isLoading } = useGetSaldo(paramGetSaldo);



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

        <Card sx={{ p: 0, mb: 3 }}>
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
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Card>

        {currentTab === 'general' ? (<ProductoCard currentProducto={currentProduct} />) : null}
        {currentTab === 'transacciones' ? (<ProductoTrn currentProducto={currentProduct} />) : null}
        {currentTab === 'preciosc' ? (<ProductoPreciosCompras currentProducto={currentProduct} />) : null}
        {currentTab === 'preciosv' ? (<ProductoPreciosVentas currentProducto={currentProduct} />) : null}
        {currentTab === 'archivos' ? (<ProductoFiles currentProducto={currentProduct} />) : null}
        {currentTab === 'estadisticas' ? (<ProductoGraficos currentProducto={currentProduct} />) : null}



      </DashboardContent>
    </>
  );
}
