import { useMemo } from 'react';
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
import { CustomColumn } from '../../core/components/dataTable/types';
// sections

// ----------------------------------------------------------------------

export default function Empresa() {
  const { themeStretch } = useSettingsContext();



  const schemaEmpresa = Yup.object().shape({
    nom_empr: Yup.string().required('Nombre es obligatorio'),
    identificacion_empr: Yup.string().required('Identificación es obligatorio'),
    mail_empr: Yup.string().required('Correo electrónico es obligatorio').email('Correo electrónico no valido'),
  });

  const frmEmpresa = useFormTable({
    config: getTableQueryEmpresa(),
    customColumns: [
      {
        name: 'ide_empr', visible: false
      },
      {
        name: 'fecha_empr', label: 'Fecha Creación'
      },
      {
        name: 'logo_empr', label: 'Logo'
      },
      {
        name: 'nom_empr', label: 'Empresa'
      }
    ]
  })

  const onChangeNombre = (): void => {
    console.log(frmEmpresa.columns)
  };

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
      <button type="button" className="ql-script" value="super" onClick={onChangeNombre} />

      <FormTable
        currentValues={frmEmpresa.currentValues}
        schema={schemaEmpresa}
        columns={frmEmpresa.columns}
        isUpdate={frmEmpresa.isUpdate}
        loading={frmEmpresa.loading}
        onSave={frmEmpresa.onSave}


      />
    </>
  );
}
