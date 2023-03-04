// @mui
import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections

// ----------------------------------------------------------------------

export default function ConsultaAuditoria() {
  return (
    <>
      <Helmet>
        <title> Consulta Auditoria Usuarios</title>
      </Helmet>
      <Container>
        <CustomBreadcrumbs
          heading="Auditoria"
          links={[
            {
              name: 'Consulta Auditoria Usuarios',
              href: PATH_DASHBOARD.auditoria.root,
            },
            { name: 'Consulta Auditoria Usuarios' },
          ]}
        />
      </Container>
    </>
  );
}
