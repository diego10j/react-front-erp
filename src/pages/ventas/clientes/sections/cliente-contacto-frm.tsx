import type { ObjectQuery } from 'src/core/types';
import type { IAddressItem } from 'src/types/common';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { save, getSeqTable } from 'src/api/core';
import { useDropdown } from 'src/core/components/dropdown';
import { useGetListDataGenero } from 'src/api/sistema/general';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
const tableName = 'gen_direccion_persona';
const primaryKey = 'ide_gedirp';

export type ClienteContactoSchemaType = zod.infer<typeof ClienteContactoSchema>;

export const ClienteContactoSchema = zod.object({
  nombre_dir_gedirp: zod.string().min(1, { message: 'Nombre es requerido!' }),
  // Not required
  ide_gedirp: zod.number().nullable(),
  ide_geper: zod.number().nullable(),
  ide_gegen: zod.number().nullable(),
  referencia_gedirp: zod.string().nullable(),
  telefono_gedirp: zod.string().nullable(),
  movil_gedirp: zod.string().nullable(),
  correo_gedirp: zod.string().email({ message: '¡Correo electrónico válido!' }).nullable(),
  activo_gedirp: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  ide_geper: number;
  open: boolean;
  isUpdate?: boolean;
  onClose: () => void;
  onCreate: (address: IAddressItem) => void;
};

export function ClienteContactoForm({ open, onClose, onCreate, isUpdate = false, ide_geper }: Props) {

  const droGenero = useDropdown({ config: useGetListDataGenero() });

  const defaultValues = {
    nombre_dir_gedirp: '',
    ide_gedirp: null,
    ide_gegen: null,
    ide_geper,
    referencia_gedirp: null,
    telefono_gedirp: null,
    movil_gedirp: null,
    correo_gedirp: null,
    activo_gedirp: true,
  };

  const methods = useForm<ClienteContactoSchemaType>({
    mode: 'all',
    resolver: zodResolver(ClienteContactoSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data', data);

      if (isUpdate === false) {
        const seqTable = await callSequenceTableService();
        // Asigna pk secuencial Tabla
        data.ide_gedirp = seqTable;
      }
      const [module, table] = tableName.split('_');
      const listQuery: ObjectQuery[] = [{
        operation: !isUpdate ? 'insert' : 'update',
        module,
        tableName: table,
        primaryKey,
        object: data
      }
      ];


      await save({
        listQuery
      });
      toast.success(!isUpdate ? 'Creado con exito!' : 'Actualizado con exito!');



      onClose();
    } catch (error) {
      console.error(error);
    }
  });



  /**
    * Llama al servicio web para obtner el proximo secuencial de la tabla
    * @returns
    */
  const callSequenceTableService = async (): Promise<number> => getSeqTable(tableName, primaryKey, 1);


  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isUpdate ? 'Actualizar Contacto' : 'Nuevo Contacto'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 2 }}>


            <Field.Text name="nombre_dir_gedirp" label="Nombre" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >

              <Field.Dropdown name="ide_gegen" label="Género" useDropdown={droGenero} />

              <Field.Text name="correo_gedirp" label="Correo" />


              <Field.Text name="telefono_gedirp" label="Teléfono" />
              <Field.Text name="movil_gedirp" label="Celular" />

            </Box>
            <Field.Text name="referencia_gedirp" label="Observaciones" />

          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancelar
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Guardar
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
