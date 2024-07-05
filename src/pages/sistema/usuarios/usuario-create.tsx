
import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from "@mui/material";

import { paths } from '../../../routes/paths';

import { useFormTable } from "../../../core/components/form";
import { DashboardContent } from '../../../layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';

import UsuarioFRT from './sections/usuario-frt';
import { useTableQueryUsuario } from '../../../api/usuarios';
import { save } from 'src/api/core';



const metadata = { title: `Nuevo Usuario` };


export default function UsuarioCreatePage() {

  const frmTable = useFormTable({ config: useTableQueryUsuario('') });

  const handleSubmit = useCallback(async (data: any) => {
    console.log(data);
  },
    []
  );

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Crear"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Usuarios', href: paths.dashboard.sistema.usuarios.list },
            { name: 'Nuevo Usuario' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <UsuarioFRT useFormTable={frmTable} />
        </Card>
      </DashboardContent>
    </>
  );

}
