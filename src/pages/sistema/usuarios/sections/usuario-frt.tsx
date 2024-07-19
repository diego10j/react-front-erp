import { z as zod } from 'zod';
import { useMemo, useState, useEffect, useCallback } from "react";

import { Box , Card, Grid } from '@mui/material';

import FormTable from 'src/core/components/form';
import { useUploadImage } from 'src/core/components/upload';
import { listDataPerfiles } from 'src/api/sistema/usuarios';
import UploadImage from 'src/core/components/upload/UploadImage';

import { Label } from 'src/components/label';

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

  const [estado, setEstado] = useState<boolean>(false);
  // Upload Logo
  const upiAvatar = useUploadImage();

  /**
   * Asigna el url cuando se hace un upload de una imagen
   */
  useEffect(() => {
    if (upiAvatar.file) {
      useFormTable.setValue('avatar_usua', upiAvatar.file);
      useFormTable.updateChangeColumn('avatar_usua');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upiAvatar.file]);

  /**
 * Asigna el logo que se encuentra en la base de datos
 */
  useEffect(() => {
    if (useFormTable.initialize === true) {
      upiAvatar.setFile(useFormTable.getValue('avatar_usua'));
      setEstado(useFormTable.getValue('activo_usua') === true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useFormTable.initialize]);

  const handleChangeEstado = useCallback(() => {
    setEstado(useFormTable.getValue('activo_usua') === true)
  },
    [useFormTable]
  );


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_usua', visible: false,
    },
    {
      name: 'uuid', visible: false,
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


    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card sx={{ pt: 10, pb: 5, px: 3 }}>
          <Label
            color={estado === true ? 'success' : 'error'}
            sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
          >
            {estado === true ? 'Activo' : 'Inactivo'}
          </Label>
          <Box sx={{ mb: 5 }} >
            <UploadImage useUploadImage={upiAvatar} />
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <FormTable
          ref={useFormTable.formRef}
          useFormTable={useFormTable}
          schema={FromTableSchema}
          customColumns={customColumns}
          numSkeletonCols={12}
          eventsColumns={
            [
              {
                name: 'activo_usua', onChange: handleChangeEstado
              },
            ]
          }
        />

      </Grid>
    </Grid>


  );


}
