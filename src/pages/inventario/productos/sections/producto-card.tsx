import { useCallback } from 'react';

import { Box, Card, Link, Stack, Button, Divider, CardHeader, IconButton, cardClasses, ListItemText, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { varAlpha } from 'src/theme/styles';
import { ActiveLabel } from 'src/core/components/labels';

import { Iconify } from "src/components/iconify";

import ProductoLog from './producto-log';
import BooleanLabel from '../../../../core/components/labels/boolean-label';
import SaldosBodegasDTQ from './saldos-bodegas-dtq';

// ----------------------------------------------------------------------

type Props = {
  currentProducto: any;
};
export default function ProductoCard({ currentProducto }: Props) {

  const router = useRouter();
  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.inventario.productos.edit(`${currentProducto?.uuid}`));
  }, [currentProducto?.uuid, router]);

  return (


    <Box
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: { xs: 'column', lg: 'row' },
      }}
    >
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          minWidth: { lg: 0 },
          py: 0,
          flexDirection: 'column',
          flex: { lg: '1 1 auto' },
          px: 0,
          pr: { lg: 3 },
          borderRight: (theme) => ({
            lg: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          }),
        }}
      >

        <Card>
          <CardHeader
            title="Detalles del producto"
            action={
              <IconButton onClick={handleEdit}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            }
          />
          <Box
            sx={{ p: 3 }}
            rowGap={2}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          >
            <ListItemText
              primary='Tipo'
              secondary={currentProducto.nombre_intpr}
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='Estado'
              secondary={
                <ActiveLabel active={currentProducto.activo_inarti} />
              }
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='Categoría'
              secondary={currentProducto.nombre_incate}
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='Bodega por defecto'
              secondary={currentProducto.nombre_inbod}
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='En Venta'
              secondary={
                <BooleanLabel value={currentProducto.se_vende_inarti} />
              }
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='En Compra'
              secondary={
                <BooleanLabel value={currentProducto.se_compra_inarti} />
              }
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='Control Inventario'
              secondary={
                <BooleanLabel value={currentProducto.hace_kardex_inarti} />
              }

              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
            <ListItemText
              primary='Url'
              secondary={
                <Link href={currentProducto.url_inarti} target="_blank" rel="noreferrer"> {currentProducto.url_inarti}</Link>
              }
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'subtitle2',
              }}
            />



            <ListItemText
              primary='Unidad de Medida'
              secondary={currentProducto.nombre_inuni}
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />


            <ListItemText
              primary='Etiquetas'
              secondary=''
              primaryTypographyProps={{ mb: 0.5, typography: 'body2', color: 'text.secondary' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.primary',
                typography: 'subtitle2',
              }}
            />
          </Box>




          <Divider />
          <Stack alignItems="flex-end" sx={{ p: 3 }}>
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
          </Stack>


        </Card>

        <Card>
          <CardHeader
            title="Stock por Bodegas"
          />

          <Stack sx={{ mt: 2, mx: 1, pb: 3 }}>
            <SaldosBodegasDTQ params={{ ide_inarti: currentProducto.ide_inarti }} />
          </Stack>
        </Card>


      </Box>

      <Box
        sx={{
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 0, sm: 0, xl: 5 },
          pt: 0,
          pb: 3,
          flexShrink: { lg: 0 },
          gap: { xs: 3, lg: 5, xl: 8 },
          maxWidth: { lg: 320, xl: 360 },
          bgcolor: { lg: 'background.neutral' },
          [`& .${cardClasses.root}`]: {
            p: { xs: 3, lg: 3 },
            boxShadow: { lg: 'none' },
            bgcolor: { lg: 'transparent' },
          },
        }}
      >
        {currentProducto && (
          <ProductoLog currentProducto={currentProducto} />
        )}

      </Box>
    </Box>






  );


}


