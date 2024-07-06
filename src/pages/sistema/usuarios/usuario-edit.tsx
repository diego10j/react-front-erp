
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';

import { useFormTable } from "src/core/components/form";
import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import UsuarioFRT from './sections/usuario-frt';
import { useParams } from '../../../routes/hooks';
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

          <UsuarioFRT useFormTable={frmTable} />

      </DashboardContent>
    </>
  );

}
