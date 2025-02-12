import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useFormTable } from 'src/core/components/form';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetTableQueryClienteByUuid } from 'src/api/ventas/clientes';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import ClienteFRT from './sections/cliente-frt';

// ----------------------------------------------------------------------

const metadata = { title: `Editar Cliente` };


export default function ClienteEditView() {

  const params = useParams();

  const { id } = params; // obtiene parametro id de la url


  const frmTable = useFormTable({ config: useGetTableQueryClienteByUuid(id) });

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Editar Cliente"
          links={[
            {
              name: 'Lista de Clientes',
              href: paths.dashboard.ventas.clientes.list,
            },
            {
              name: frmTable.getValue('nom_geper') || '',
              href: paths.dashboard.ventas.clientes.details(id || '')
            },
          ]}
          activeLast
          sx={{
            mb: 0,
          }}
        />

        <ClienteFRT useFormTable={frmTable} />
      </DashboardContent>
    </>
  );
}
