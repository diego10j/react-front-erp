import * as Yup from 'yup';
import { useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

// @mui
import { Container } from '@mui/material';

// routes
import { paths } from 'src/routes/paths';

// hooks
import { useSettingsContext } from '../../components/settings';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import FormTable, { useFormTable } from '../../core/components/form';
import { getListDataPerfiles, getTableQueryUsuario } from '../../services/core/serviceUsuario';

// sections

// ----------------------------------------------------------------------

export default function Usuarios() {
  const { themeStretch } = useSettingsContext();

  const refFrmTable = useRef();
  const frmTable = useFormTable({ config: getTableQueryUsuario(11), ref: refFrmTable });

  const customColumns = useMemo(() => [
    {
      name: 'ide_usua', visible: false
    },
    {
      name: 'ide_perf', dropDown: getListDataPerfiles(),
    },
  ], []);


  // esquema de validaciones
  const schemaTable = Yup.object().shape({
    nom_usua: Yup.string().required('Nombre es obligatorio'),
    ide_perf: Yup.string().required('Perfil es obligatorio'),
    mail_usua: Yup.string().required('Correo electrónico es obligatorio').email('Correo electrónico no valido'),
  });

  const onChangePerfil = (): void => {
    frmTable.setValue('avatar_usua', 'CHANGE AVATAR');
    console.log(frmTable.getValue('ide_perf'));
  };

  const onChangeActivo = (): void => {
    console.log(frmTable.getValue('activo_usua'));
  };

  return (
    <>
      <Helmet>
        <title>Usuarios</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Listado de Usuarios"
          links={[
            {
              name: 'Dashboard', href: paths.dashboard.auditoria.root,
            },
            { name: 'Usuarios' },
          ]}
        />
      </Container>

      <FormTable
        ref={refFrmTable}
        useFormTable={frmTable}
        schema={schemaTable}
        customColumns={customColumns}
        eventsColumns={
          [
            {
              name: 'ide_perf', onChange: onChangePerfil
            },
            {
              name: 'activo_usua', onChange: onChangeActivo
            }
          ]
        }
      />
    </>
  );
}
