// @mui
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// components
import { CustomBreadcrumbs } from '../../components/custom-breadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function SimpleUI() {

  return (
    <>
      <Helmet>
        <title> SimpleUi</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Auditoria"
          links={[
            {
              name: 'Consulta Auditoria Usuarios',
              href: paths.dashboard.auditoria.root,
            },
            { name: 'Consulta Auditoria Usuarios' },
          ]}
        />
      </Container>
    </>
  );
}
