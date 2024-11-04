
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';

import { useFormTable } from 'src/core/components/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTableQueryClienteByUuid } from 'src/api/ventas/clientes';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ClienteFRT from './sections/cliente-frt';

// ----------------------------------------------------------------------
const metadata = { title: `Crear Cliente` };


export default function ClienteCreatePage() {

  const frmTable = useFormTable({ config: useGetTableQueryClienteByUuid() });

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Crear Cliente"
          links={[
            {
              name: 'Listado de Clientes',
              href: paths.dashboard.ventas.clientes.list,
            },
            { name: 'Nuevo Cliente' },
          ]}
          sx={{
            mb: 0,
          }}
        />
        <ClienteFRT useFormTable={frmTable} />

      </DashboardContent>
    </>
  );
}
