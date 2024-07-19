
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';

import { useFormTable } from "src/core/components/form";
import { DashboardContent } from 'src/layouts/dashboard';
import { useTableQueryUsuarioByUuid } from 'src/api/sistema/usuarios';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UsuarioFRT from './sections/usuario-frt';
import { useParams } from '../../../routes/hooks';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Editar',
  title: 'Editar Usuario',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
  parent1: { name: 'Listado de Usuarios', href: paths.dashboard.sistema.usuarios.list }
};


export default function UsuarioEditPage() {

  const { id } = useParams();

  const frmTable = useFormTable({ config: useTableQueryUsuarioByUuid(id) });


  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Editar"
          links={[
            metadata.parent,
            metadata.parent1,
            { name: frmTable.getValue('nom_usua') || '' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <UsuarioFRT useFormTable={frmTable} />

      </DashboardContent>
    </>
  );

}
