import * as Yup from 'yup';
import { useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// @mui
import { Box, Card, Grid, Container } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

import Label from '../../components/label';
import { useTableQueryEmpresa } from '../../api/sistema';
// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import FormTable, { useFormTable } from '../../core/components/form';
import { getNombreEmpresa } from '../../services/core/serviceSistema';
import UploadImage, { useUploadImage } from '../../core/components/upload';
// services
import {  getOptionsObligadoContabilidad } from '../../services/core/serviceEmpresa';
// ----------------------------------------------------------------------

export default function Empresa() {

  const { themeStretch } = useSettingsContext();

  // Formulario Empresa
  const refFrmEmpresa = useRef();
  const frmEmpresa = useFormTable({ config: useTableQueryEmpresa(), ref: refFrmEmpresa });

  // Esquema de validaciones formulario
  const schemaEmpresa = Yup.object().shape({
    nom_empr: Yup.string().required('Nombre es obligatorio'),
    identificacion_empr: Yup.string().required('Identificación es obligatorio'),
    mail_empr: Yup.string().required('Correo electrónico es obligatorio').email('Correo electrónico no valido'),
  });

  // Upload Logo
  const upiLogo = useUploadImage();

  /**
   * Asigna el url cuando se hace un upload de una imagen
   */
  useEffect(() => {
    if (upiLogo.url) frmEmpresa.setValue('logo_empr', upiLogo.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upiLogo.url]);

  /**
   * Asigna el logo que se encuentra en la base de datos
   */
  useEffect(() => {
    if (frmEmpresa.initialize === true) upiLogo.setFile(frmEmpresa.getValue('logo_empr'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frmEmpresa.initialize]);

  return (
    <>
      <Helmet>
        <title>Empresa</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Editar Empresa"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: getNombreEmpresa() },
          ]}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Label
                color='success'
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                Activo
              </Label>
              <Box sx={{ mb: 5 }} >
                <UploadImage useUploadImage={upiLogo} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormTable
              ref={refFrmEmpresa}
              useFormTable={frmEmpresa}
              schema={schemaEmpresa}
              numSkeletonCols={14}
              customColumns={
                [
                  {
                    name: 'ide_empr', visible: false
                  },
                  {
                    name: 'logo_empr', visible: false
                  },
                  {
                    name: 'obligadocontabilidad_empr', radioGroup: getOptionsObligadoContabilidad()
                  },
                ]
              }
            />
          </Grid>
        </Grid>
      </Container>


    </>
  );
}
