// @mui
import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function SimpleUI() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> SimpleUi</title>
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
