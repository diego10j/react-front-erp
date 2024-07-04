
import React, { useRef } from "react";
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';

import { Card } from "@mui/material";
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';

import { useParams } from '../../../routes/hooks';
import UsuarioFRT from './sections/usuario-frt';
import { useFormTable } from "src/core/components/form";
import { useTableQueryUsuario } from '../../../api/usuarios';



const metadata = { title: `Editar Usuario` };


export default function UsuarioEditPage() {

  const { id = '' } = useParams();

  const frmTable = useFormTable({ config: useTableQueryUsuario(id) });


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
            { name: frmTable.getValue('nom_usua') || '' },
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
