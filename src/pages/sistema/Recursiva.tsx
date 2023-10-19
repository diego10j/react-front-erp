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

export default function Recursiva() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Recursiva</title>
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
