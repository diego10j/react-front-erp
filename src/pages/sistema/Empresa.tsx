import * as Yup from 'yup';
// @mui
import { Container } from '@mui/material';
import { Helmet } from 'react-helmet-async';
// routes
import { useRef } from 'react';
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

  const refFrmEmpresa = useRef();
  const frmEmpresa = useFormTable({ config: getTableQueryEmpresa(), ref: refFrmEmpresa });

  // esquema de validaciones formulario
  const schemaEmpresa = Yup.object().shape({
    nom_empr: Yup.string().required('Nombre es obligatorio'),
    identificacion_empr: Yup.string().required('Identificación es obligatorio'),
    mail_empr: Yup.string().required('Correo electrónico es obligatorio').email('Correo electrónico no valido'),
  });



  const onChangeNombre = (): void => {
    frmEmpresa.setValue('direccion_empr', 'xxxxx');
    console.log(frmEmpresa.currentValues)
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
        ref={refFrmEmpresa}
        currentValues={frmEmpresa.currentValues}
        schema={schemaEmpresa}
        columns={frmEmpresa.columns}
        setColumns={frmEmpresa.setColumns}
        isUpdate={frmEmpresa.isUpdate}
        loading={frmEmpresa.loading}
        onSave={frmEmpresa.onSave}

        customColumns={
          [
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
              name: 'nom_empr', label: 'Empresa', onChange: onChangeNombre
            }
          ]
        }


      />
    </>
  );
}
