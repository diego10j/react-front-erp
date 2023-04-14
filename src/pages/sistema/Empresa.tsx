import * as Yup from 'yup';
// @mui
import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import FormTable from '../../core/components/form/FormTable';
import { useFormTable } from '../../core/components/form';
import { getTableQueryEmpresa } from '../../services/core/serviceEmpresa';
// sections

// ----------------------------------------------------------------------

export default function Empresa() {
  const { themeStretch } = useSettingsContext();


  const schemaEmpresa = Yup.object().shape({
    nom_empr: Yup.string().required('Nombre es obligatorio'),
    identificacion_empr: Yup.string().required('Identificación es obligatorio'),
    mail_empr: Yup.string().required('Correo electrónico es obligatorio').email('Correo electrónico no valido'),
  });

  const frmEmpresa = useFormTable({ config: getTableQueryEmpresa('ide_empr,nom_empr,mail_empr,identificacion_empr') })



  return (
    <>
      <Helmet>
        <title>Empresa</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Infromación de la empresa"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Editar Empresa' },
          ]}
        />
      </Container>
      <FormTable currentValues={frmEmpresa.currentValues} schema={schemaEmpresa} columns={frmEmpresa.columns} isUpdate={frmEmpresa.isUpdate} loading={frmEmpresa.loading} />
    </>
  );
}
