/* eslint-disable unused-imports/no-unused-imports */

import { useMemo, useEffect, useCallback } from 'react';

import { Box, Card, Grid, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { WidgetTotal } from 'src/core/components/widget/widget-total';
import UploadImage, { useUploadImage } from 'src/core/components/upload';
import { fCurrency } from 'src/utils/format-number';

import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';
import { Label } from 'src/components/label';


// ----------------------------------------------------------------------

type Props = {
  data: any;
};
export default function ClienteCard({ data }: Props) {

  const router = useRouter();


  const { cliente: currentCliente } = data;

  // Upload Logo
  const upiLogo = useUploadImage();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.ventas.clientes.edit(`${currentCliente?.uuid}`));
  }, [currentCliente?.uuid, router]);


  /**
     * Asigna el url cuando se hace un upload de una imagen
     */
  useEffect(() => {
    if (upiLogo.file) {
      console.log(upiLogo.file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upiLogo.file]);


  const renderWidgets = useMemo(() => (
    <Grid container spacing={2} sx={{ my: 3 }}>
      {[
        { title: 'Total Ventas', total: fCurrency(10), icon: 'vaadin:invoice', color: 'primary' },
        { title: 'Última Venta', total: 0, icon: 'mynaui:calendar-up', color: 'warning' },
        { title: 'Primera Venta', total: 0, icon: 'mynaui:calendar-down', color: 'secondary' },
        { title: 'Total Facturas', total: 0, icon: 'lsicon:work-order-appointment-outline', color: 'info' },
      ].map((widget, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <WidgetTotal {...widget} />
        </Grid>
      ))}
    </Grid>
  ), []);

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
          <Button variant="soft" color="error" >
            Eliminar
          </Button>
        </Stack>

      </MenuToolbar>


      <Grid container spacing={3} sx={{ pt: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Label
              color={currentCliente.activo_geper === true ? 'success' : 'error'}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {currentCliente.activo_geper === true ? 'Activo' : 'Inactivo'}
            </Label>
            <Box sx={{ mb: 5 }} >
              <UploadImage useUploadImage={upiLogo} />
            </Box>
          </Card>
        </Grid>


        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                {renderField('Tipo Cliente', currentCliente.detalle_getip)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Tipo Identificación', currentCliente.nombre_getid)}
              </Grid>

              <Grid item xs={12} md={3}>
                {renderField('Identificación', currentCliente.identificac_geper)}
              </Grid>
              <Grid item xs={12} md={9}>
                {renderField('Nombre', currentCliente.nom_geper)}
              </Grid>

              <Grid item xs={12} md={6}>
                {renderField('Tipo de Contribuyente', currentCliente.nombre_cntco)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Código', currentCliente.codigo_geper)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Correo electrónico', currentCliente.correo_geper)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Teléfono', currentCliente.telefono_geper)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Vendedor', currentCliente.nombre_vgven)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Forma de Pago', currentCliente.nombre_cndfp)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Dias de Crédito', currentCliente.dias_credito_geper)}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField('Límite de Crédito', currentCliente.limite_credito_geper)}
              </Grid>
              <Grid item xs={12} md={12}>
                {renderTextField('Observación', currentCliente.observacion_geper)}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {renderWidgets}

    </>

  );

}

const renderField = (label: string, value: any) => (
  <Box
    sx={{
      borderBottom: '1px dashed',
      borderColor: 'divider',
      pb: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: 'text.disabled',
        fontSize: '0.75rem',
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="body2"
    >
      {value}
    </Typography>
  </Box>
);

const renderTextField = (label: string, value: any) => (
  <Box
    sx={{
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 1,
      p: 2,
      position: 'relative',
    }}
  >
    <Typography
      variant="caption"
      color="text.disabled"
      sx={{
        position: 'absolute',
        top: '-8px',
        left: '12px',
        px: 0.5,
      }}
    >
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);
