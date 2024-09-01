
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import BodegaFRM from './sections/bodega-frm';

// ----------------------------------------------------------------------
const metadata = {
  header: 'Modificar Bodega',
  title: 'Editar Bodega',
  parent: { name: 'Inventario', href: paths.dashboard.inventario.root },
  parent1: { name: 'Listado de Bodegas', href: paths.dashboard.inventario.bodegas.list }
};


export default function BodegasEditPage() {
  const params = useParams();

  const { id } = params; // obtiene parametro id de la url

  return (
    <>
      <Helmet>
        <title> {metadata.title} - {metadata.parent.name} </title>
      </Helmet>
      <DashboardContent>
        <CustomBreadcrumbs
          heading={metadata.header}
          links={[
            metadata.parent,
            metadata.parent1,
            { name: metadata.title },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <BodegaFRM ide={Number(id)} />
      </DashboardContent>
    </>
  );
}
