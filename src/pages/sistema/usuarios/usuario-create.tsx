
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useRouter } from 'src/routes/hooks';

import { useGetTableQueryUsuarioByUuid } from 'src/api/sistema/usuarios';

import { paths } from '../../../routes/paths';
import UsuarioFRT from './sections/usuario-frt';
import { useFormTable } from "../../../core/components/form";
import { DashboardContent } from '../../../layouts/dashboard';
import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';


// ----------------------------------------------------------------------
const metadata = {
  header: 'Nuevo',
  title: 'Nuevo Usuario',
  parent: { name: 'Administración', href: paths.dashboard.sistema.root },
  parent1: { name: 'Listado de Usuarios', href: paths.dashboard.sistema.usuarios.list }
};

export default function UsuarioCreatePage() {

  const router = useRouter();
  const frmTable = useFormTable({ config: useGetTableQueryUsuarioByUuid() });

  /**
   * Cuando hace el submmit redirecciona a la pagina de lista
   */
  useEffect(() => {
    if (frmTable.isSubmitSuccessful() === true) {
      router.push(paths.dashboard.sistema.usuarios.list);
    }
  }, [frmTable, router]);

  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Crear"
          links={[
            metadata.parent,
            metadata.parent1,
            { name: metadata.title },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <UsuarioFRT useFormTable={frmTable} />

      </DashboardContent>
    </>
  );

}
