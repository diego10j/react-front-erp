// @mui
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';
// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function Simple() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Simple</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Simple"
          links={[
            { name: 'Pantalla Simple' },
          ]}
        />
      </Container>
    </>
  );
}
