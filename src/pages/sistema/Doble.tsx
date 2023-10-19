// @mui
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function Doble() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Doble</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
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
