
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useRouter } from 'src/routes/hooks';

import { paths } from '../../../routes/paths';
import UsuarioFRT from './sections/usuario-frt';
import { useFormTable } from "../../../core/components/form";
import { useTableQueryUsuario } from '../../../api/usuarios';
import { DashboardContent } from '../../../layouts/dashboard';
import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';

const metadata = { title: `Nuevo Usuario` };

export default function UsuarioCreatePage() {

  const router = useRouter();
  const frmTable = useFormTable({ config: useTableQueryUsuario('') });

  /**
   * Cuando hace el submmit redirecciona a la pagina de lista
   */
  useEffect(() => {
    if (frmTable.isSuccessSubmit === true) {
      frmTable.setIsSuccessSubmit(false);
      router.push(paths.dashboard.sistema.usuarios.list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frmTable.isSuccessSubmit]);

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

          <UsuarioFRT useFormTable={frmTable} />

      </DashboardContent>
    </>
  );

}
