
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { Card } from "@mui/material";

import { paths } from '../../../routes/paths';

import { useFormTable } from "../../../core/components/form";
import { DashboardContent } from '../../../layouts/dashboard';

import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';

import UsuarioFRT from './sections/usuario-frt';
import { useTableQueryUsuario } from '../../../api/usuarios';



const metadata = { title: `Nuevo Usuario` };


export default function UsuarioCreatePage() {
  const frmTable = useFormTable({ config: useTableQueryUsuario('') });
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Editar"
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
