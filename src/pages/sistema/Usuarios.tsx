import type { CustomColumn } from 'src/core/types';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import FormTable, { useFormTable } from 'src/core/components/form';
import { listDataPerfiles, useTableQueryUsuarioByUuid } from 'src/api/sistema/usuarios';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------
// esquema de validaciones

export const TableSchema = zod.object({
  nom_usua: zod
    .string()
    .min(1, { message: 'El Nombre es obligatorio' }),
  ide_perf: zod
    .string()
    .min(1, { message: 'El Perfil es obligatorio!' }),
  mail_usua: zod
    .string()
    .min(1, { message: 'El Correo electrónico es obligatorio!' })
    .email({ message: 'Correo electrónico no valido!' }),
});

export default function Usuarios() {


  const frmTable = useFormTable({ config: useTableQueryUsuarioByUuid('11') });

  const customColumns: Array<CustomColumn> = useMemo(() => [
    {
      name: 'ide_usua', visible: false
    },
    // {
    //   name: 'ide_perf', dropDown: listDataPerfiles, visible: true, label: 'Perfil'
    // },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);




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
      <Container>
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
        ref={frmTable.formRef}
        useFormTable={frmTable}
        schema={TableSchema}
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
