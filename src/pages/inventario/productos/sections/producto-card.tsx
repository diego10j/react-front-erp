
import { useCallback } from 'react';

import { Box, Tab, Card, Link, Grid, Tabs, Paper, Stack, Button, Rating, Divider, Typography, CardHeader, ListItemText, Chip } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTabs } from 'src/hooks/use-tabs';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';
import { ActiveLabel } from 'src/core/components/labels';
import { WidgetTotal } from 'src/core/components/widget/widget-total';
import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';
import { CarouselImages } from 'src/core/components/carousel-images/carousel-images';

import { Iconify } from "src/components/iconify";
import { Markdown } from 'src/components/markdown';
import { EmptyContent } from 'src/components/empty-content';

import ProductoLog from './producto-log';
import SaldosBodegasDTQ from './saldos-bodegas-dtq';
import BooleanLabel from '../../../../core/components/labels/boolean-label';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};
export default function ProductoCard({ data }: Props) {

  const router = useRouter();

  const tabs = useTabs('description');

  const { producto: currentProducto, stock, datos } = data;

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.inventario.productos.edit(`${currentProducto?.uuid}`));
  }, [currentProducto?.uuid, router]);

  const renderWidgets = (
    <Grid container spacing={2} sx={{ my: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <WidgetTotal
          icon="fluent:person-info-24-regular"
          title="Total Clientes"
          total={datos.total_clientes || 0}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <WidgetTotal
          icon="mynaui:calendar-up"
          title="Última Venta"
          total={fDate(datos.ultima_fecha_venta)}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <WidgetTotal
          icon="mynaui:calendar-down"
          title="Primera Venta"
          total={fDate(datos.primera_fecha_venta)}
          color="secondary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <WidgetTotal
          icon="solar:document-text-linear"
          title="Total Facturas"
          total={datos.total_facturas}
          color="error"
        />
      </Grid>

    </Grid>

  );

  const renderStock = (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={9} md={9}>
        <Card sx={{ p: 3 }}>
          <CardHeader sx={{ p: 0 }}
            title="Stock por Bodegas"
          />
          <Grid container spacing={3} sx={{ pt: 1.5 }}>
            <Grid item xs={12} sm={8} md={8} >
              <SaldosBodegasDTQ params={{ ide_inarti: currentProducto.ide_inarti || -1 }} />
            </Grid>
            <Grid item xs={12} sm={4} md={4} >
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  px: 3,
                  gap: 2,
                  minWidth: 200,
                  flexShrink: 0,
                  borderRadius: 2,
                  display: 'flex',
                  typography: 'body2',
                  borderStyle: 'dashed',
                  flexDirection: 'column',
                }}
              >
                {renderItem('Unidad de medida', currentProducto.nombre_inuni, 'la:weight', 'info')}
                {renderItem('Stock mínimo', `${currentProducto.cant_stock1_inarti || 0} ${currentProducto.siglas_inuni}`, 'solar:double-alt-arrow-down-bold-duotone', 'error')}
                {renderItem('Stock ideal', `${currentProducto.cant_stock2_inarti || 0} ${currentProducto.siglas_inuni}`, 'solar:double-alt-arrow-up-bold-duotone', 'success')}
              </Paper>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} sm={3} md={3} >
        <Card sx={{
          p: 3,
          gap: 2,
          minWidth: 200,
          flexShrink: 0,
          display: 'flex',
          typography: 'body2',
          flexDirection: 'column',
        }}>
          {[
            {
              label: 'Cantidad mínima vendida',
              value: `${datos.min_cantidad_venta} ${currentProducto.siglas_inuni}`,
              icon: "material-symbols:monitor-weight-loss-outline-rounded",
              color: 'primary'
            },
            {
              label: 'Cantidad máxima vendida',
              value: `${datos.max_cantidad_venta} ${currentProducto.siglas_inuni}`,
              icon: "material-symbols:monitor-weight-gain-outline-rounded",
              color: 'warning'
            },
            {
              label: 'Cantidad mínima comprada',
              value: `${datos.min_cantidad_compra} ${currentProducto.siglas_inuni}`,
              icon: "material-symbols:monitor-weight-loss-outline-rounded",
              color: 'primary'
            },
            {
              label: 'Cantidad máxima comprada',
              value: `${datos.max_cantidad_compra} ${currentProducto.siglas_inuni}`,
              icon: "material-symbols:monitor-weight-gain-outline-rounded",
              color: 'warning'
            },
          ].map((item) => (
            <Stack key={item.label} spacing={0.5}>
              <Box sx={{ typography: 'body2', color: 'text.secondary', overflow: 'hidden', maxWidth: '98%', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {item.label}
              </Box>
              <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                <Iconify
                  width={22}
                  icon={item.icon}
                  sx={{ flexShrink: 0, color: `${item.color}.main`, mr: 1 }}
                />
                {item.value}
              </Box>
            </Stack>
          ))}
        </Card>
      </Grid>
    </Grid >
  );


  const renderDetails = (
    <Card>
      <Tabs
        value={tabs.value}
        onChange={tabs.onChange}
        sx={{
          px: 3,
          boxShadow: (theme_) =>
            `inset 0 -2px 0 0 ${varAlpha(theme_.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {[
          { value: 'description', label: 'Descripción' },
          { value: 'log', label: `Actividades` },
        ].map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {tabs.value === 'description' && (
        currentProducto.publicacion_inarti ? (
          <Markdown
            children={currentProducto.publicacion_inarti}
            sx={{
              p: 3,
              '& p, li, ol, table': {
                typography: 'body2',
              },
              '& table': {
                mt: 2,
                maxWidth: 640,
                '& td': { px: 2 },
                '& td:first-of-type': { color: 'text.secondary' },
                'tbody tr:nth-of-type(odd)': { bgcolor: 'transparent' },
              },
            }}
          />
        ) : (
          <EmptyContent
            title="No existen descripción"
            sx={{ py: 10, height: 'auto', flexGrow: 'unset' }}
          />
        )
      )}
      {(tabs.value === 'log' && currentProducto) && (
        <ProductoLog currentProducto={currentProducto} />
      )}
    </Card>
  );

  return (
    <>

      <MenuToolbar>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleEdit}>
            Editar
          </Button>
          <Button variant="outlined" >
            Copiar
          </Button>
          <Button variant="contained" color="error" >
            Eliminar
          </Button>
        </Stack>

      </MenuToolbar>

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid item xs={12} md={6} lg={6}>
          <CarouselImages images={currentProducto.fotos_inarti} />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Stack spacing={3} sx={{ pt: 3 }}>
            <Stack spacing={2} alignItems="flex-start">
              <Stack direction="row" alignItems="center" spacing={1}>
                <ActiveLabel active={currentProducto.activo_inarti} />
              </Stack>

              <Box
                component="span"
                sx={{
                  typography: 'overline',
                  color: stock.color_stock
                }}
              >
                {stock.detalle_stock}
              </Box>

              <Typography variant="h5">{currentProducto.nombre_inarti}</Typography>

              <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
                <Rating size="small" value={currentProducto.total_ratings_inarti} precision={0.1} readOnly sx={{ mr: 1 }} />
                {`(${fShortenNumber(currentProducto.total_ratings_inarti)} valoraciones)`}
              </Stack>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currentProducto.observacion_inarti}
              </Typography>



            </Stack>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {renderPropiedad('Titulo', currentProducto.nombre_intpr)}
            {renderPropiedad('Categoría', currentProducto.nombre_incate)}
            {renderPropiedad('Otros Nombres', currentProducto.otro_nombre_inarti)}
            {renderBoolean('Se Vende', currentProducto.se_vende_inarti)}
            {renderBoolean('Se Compra', currentProducto.se_compra_inarti)}
            {renderBoolean('Control Inventario', currentProducto.hace_kardex_inarti)}
            {renderUrl('Url', currentProducto.url_inarti)}
          </Stack>
          {currentProducto.tags_inarti && (
            <Stack spacing={2} sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {currentProducto.tags_inarti.map((option: any) => <Chip key={option.value} label={option.label} variant="soft" />)}
              </Stack>
            </Stack>
          )}


        </Grid>
      </Grid>

      {renderWidgets}

      {currentProducto.hace_kardex_inarti === true && renderStock}

      {renderDetails}

    </>

  );

}


const renderPropiedad = (titulo: string, valor: any) =>
  <Stack direction="row" sx={{ px: 2 }}>
    <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
      {titulo}
    </Typography>
    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
      {valor || ''}
    </Typography>
  </Stack>

const renderBoolean = (titulo: string, valor: any) =>
  <Stack direction="row" sx={{ px: 2 }}>
    <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
      {titulo}
    </Typography>
    <BooleanLabel value={valor} />
  </Stack>

const renderUrl = (titulo: string, valor: any) =>
  <Stack direction="row" sx={{ px: 2 }}>
    <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
      {titulo}
    </Typography>

    <Typography variant="subtitle2" sx={{ color: 'text.primary', overflow: 'hidden', maxWidth: '70%', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
      <Link href={valor} target="_blank" rel="noreferrer"> {valor}</Link>
    </Typography>
  </Stack>


const renderItem = (titulo: string, valor: any, icono: string, color: string) =>
  <Stack spacing={0}>
    <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
      {titulo}
    </Box>
    <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
      <Iconify
        width={22}
        icon={icono}
        sx={{ flexShrink: 0, color: `${color}.dark` }}
      />
      {valor}
    </Box>
  </Stack>
