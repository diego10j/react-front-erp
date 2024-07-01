import { z as zod } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useRef, useMemo, useEffect } from 'react';

import { Box, Card, Grid, Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { getNombreEmpresa } from 'src/api/sistema';
import FormTable, { useFormTable } from 'src/core/components/form';
import UploadImage, { useUploadImage } from 'src/core/components/upload';
import { listDataEmpresa, useTableQueryEmpresa, getOptionsObligadoContabilidad } from 'src/api/empresa';

import { Label } from 'src/components/label';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// ----------------------------------------------------------------------

// Esquema de validaciones formulario
export const EmpresaSchema = zod.object({
  nom_empr: zod
    .string()
    .min(1, { message: 'El Nombre es obligatorio' }),
  identificacion_empr: zod
    .string()
    .min(1, { message: 'La Identificación es obligatorio!' })
    .min(13, { message: 'La Identificación debe tener 13 caracteres' }),
  mail_empr: zod
    .string()
    .min(1, { message: 'El Correo electrónico es obligatorio!' })
    .email({ message: 'Correo electrónico no valido!' }),
});

export default function Empresa() {

  const customColumns = useMemo(() => [
    {
      name: 'ide_empr',  visible: false,
    },
    {
      name: 'logo_empr', visible: false
    },
    {
      name: 'obligadocontabilidad_empr', radioGroup: getOptionsObligadoContabilidad()
    },
  ], []);

  // Formulario Empresa
  const refFrmEmpresa = useRef();
  const frmEmpresa = useFormTable({ config: useTableQueryEmpresa(), ref: refFrmEmpresa });


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
      <Container>
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
              schema={EmpresaSchema}
              numSkeletonCols={14}
              customColumns={customColumns}
            />
          </Grid>
        </Grid>
      </Container>


    </>
  );
}
