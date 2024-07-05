import { z as zod } from 'zod';
import React, { useMemo } from "react";

import FormTable from 'src/core/components/form';

import { listDataPerfiles } from '../../../../api/usuarios';

import type { CustomColumn } from '../../../../core/types/customColumn';
import type { UseFormTableReturnProps } from '../../../../core/components/form/types';

// ----------------------------------------------------------------------

// esquema de validaciones
export const FromTableSchema = zod.object({
  mail_usua: zod
    .string()
    .email({ message: 'Correo electrónico no valido!' }),
});


type Props = {
  useFormTable: UseFormTableReturnProps;
};

export default function UsuarioFRT({ useFormTable }: Props) {

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_usua', visible: false,
    },
    {
      name: 'ide_perf', dropDown: listDataPerfiles, visible: true, label: 'Perfil'
    },
    {
      name: 'nom_usua', required: true
    },
    {
      name: 'ide_perf', required: true
    },
    {
      name: 'mail_usua', required: true
    },
    {
      name: 'ide_gtemp', visible: false
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);


  return (
    <>

      <div>Form Value: {useFormTable.getValue('nom_usua')}</div>
      <div>formRef Value: {useFormTable.formRef.current?.getValues('nom_usua')}</div>
      <FormTable
        ref={useFormTable.formRef}
        useFormTable={useFormTable}
        schema={FromTableSchema}
        customColumns={customColumns}
        numSkeletonCols={12}
      />
    </>
  );


}
