import { z as zod } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { Box, Card, Grid } from '@mui/material';

import { paths } from 'src/routes/paths';

import { getNombreEmpresa } from 'src/api/sistema';
import { DashboardContent } from 'src/layouts/dashboard';
import FormTable, { useFormTable } from 'src/core/components/form';
import UploadImage, { useUploadImage } from 'src/core/components/upload';
import { useTableQueryEmpresa, getOptionsObligadoContabilidad } from 'src/api/empresa';

import { Label } from 'src/components/label';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import type { CustomColumn } from '../../core/types/customColumn';
// ----------------------------------------------------------------------

// Esquema de validaciones formulario
export const EmpresaSchema = zod.object({
  identificacion_empr: zod
    .string()
    .min(1, { message: 'Identificación es obligatorio!' })
    .min(13, { message: 'Identificación debe tener 13 caracteres!' }),
  mail_empr: zod
    .string()
    .min(1, { message: 'Correo electrónico es obligatorio!' })
    .email({ message: 'Correo electrónico no valido!' }),
});

export default function Empresa() {

  const [estado, setEstado] = useState<boolean>(false);

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_empr', visible: false,
    },
    {
      name: 'nom_empr', required: true,
    },
    {
      name: 'logo_empr', visible: false, formControlled: true,
    },
    {
      name: 'obligadocontabilidad_empr', radioGroup: getOptionsObligadoContabilidad()
    },
  ], []);

  // Formulario Empresa
  const frmEmpresa = useFormTable({ config: useTableQueryEmpresa() });


  // Upload Logo
  const upiLogo = useUploadImage();

  /**
   * Asigna el url cuando se hace un upload de una imagen
   */
  useEffect(() => {
    if (upiLogo.file) {
      frmEmpresa.setValue('logo_empr', upiLogo.file);
      frmEmpresa.updateChangeColumn('logo_empr');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upiLogo.file]);

  /**
   * Asigna el logo que se encuentra en la base de datos
   */
  useEffect(() => {
    if (frmEmpresa.initialize === true) {
      upiLogo.setFile(frmEmpresa.getValue('logo_empr'));
      setEstado(frmEmpresa.getValue('activo_empr') === true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frmEmpresa.initialize]);

  const handleChangeEstado = useCallback(() => {
    setEstado(frmEmpresa.getValue('activo_empr') === true)
  },
    [frmEmpresa]
  );

  return (
    <DashboardContent>
      <Helmet>
        <title>Empresa</title>
      </Helmet>

        <CustomBreadcrumbs
          heading="Editar Empresa"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: getNombreEmpresa() },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Label
                color={estado === true ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {estado === true ? 'Activo' : 'Inactivo'}
              </Label>
              <Box sx={{ mb: 5 }} >
                <UploadImage useUploadImage={upiLogo} />
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <FormTable
              ref={frmEmpresa.formRef}
              useFormTable={frmEmpresa}
              schema={EmpresaSchema}
              numSkeletonCols={14}
              customColumns={customColumns}
              eventsColumns={
                [
                  {
                    name: 'activo_empr', onChange: handleChangeEstado
                  },
                ]
              }
            />
          </Grid>
        </Grid>



    </DashboardContent>
  );
}
