import type { ObjectQuery } from 'src/core/types';
import type { IAddressItem } from 'src/types/common';
import type { IideGeprov } from 'src/types/sistema/general';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
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
import { useGetListDataCantones, useGetListDataProvincias, useGetListDataTipoDireccion } from 'src/api/sistema/general';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------
const tableName = 'gen_direccion_persona';
const primaryKey = 'ide_gedirp';

export type ClienteDireccionSchemaType = zod.infer<typeof ClienteDireccionSchema>;

export const ClienteDireccionSchema = zod.object({
  ide_getidi: zod.number().min(1, { message: 'Tipo de Dirección es requerido!' }).nullable(),
  ide_geprov: zod.number().min(1, { message: 'Provincia es requerido!' }).nullable(),
  nombre_dir_gedirp: zod.string().min(1, { message: 'Nombre es requerido!' }),
  direccion_gedirp: zod.string().min(1, { message: 'Dirección es requerido!' }),
  // Not required
  ide_gecant: zod.number().nullable(),
  ide_gedirp: zod.number().nullable(),
  ide_gepais: zod.number().nullable(),
  ide_geper: zod.number().nullable(),
  referencia_gedirp: zod.string().nullable(),
  longitud_gedirp: zod.string().nullable(),
  latitud_gedirp: zod.string().nullable(),
  telefono_gedirp: zod.string().nullable(),
  movil_gedirp: zod.string().nullable(),
  activo_gedirp: zod.boolean(),
  defecto_gedirp: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  ide_geper: number;
  open: boolean;
  isUpdate?: boolean;
  onClose: () => void;
  onCreate: (address: IAddressItem) => void;
};

export function ClienteDireccionForm({ open, onClose, onCreate, isUpdate = false, ide_geper }: Props) {

  const droTipoDireccion = useDropdown({ config: useGetListDataTipoDireccion() });

  const droProvincias = useDropdown({ config: useGetListDataProvincias() });

  const [paramIdeGeprov, setParamIdeGeprov] = useState<IideGeprov>(
    {
      ide_geprov: -1
    }
  );

  const droCantones = useDropdown({ config: useGetListDataCantones(paramIdeGeprov) });

  const defaultValues = {
    ide_getidi: null,
    ide_geprov: null,
    ide_gecant: null,
    nombre_dir_gedirp: '',
    direccion_gedirp: '',
    ide_gedirp: null,
    ide_gepais: 1,
    ide_geper,
    referencia_gedirp: null,
    longitud_gedirp: null,
    latitud_gedirp: null,
    telefono_gedirp: null,
    movil_gedirp: null,
    activo_gedirp: true,
    defecto_gedirp: false,
  };

  const methods = useForm<ClienteDireccionSchemaType>({
    mode: 'all',
    resolver: zodResolver(ClienteDireccionSchema),
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

      try {
        await save({
          listQuery
        });
        toast.success(!isUpdate ? 'Creado con exito!' : 'Actualizado con exito!');
        onClose();
      } catch (error) {
        toast.error(`Error al guardar ${error}`);
      }

    } catch (error) {
      console.error(error);
    }
  });


  /**
   * Cuando selecciona una provincia carga sus cantones
   */
  const handleChangeProvincia = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Obtén el valor actual de 'ide_geprov' desde el formulario.
    const newIdeGeprov = event.target.value;
    setValue('ide_geprov', Number(newIdeGeprov));
    setValue('ide_gecant', null);
    // Actualiza el estado 'paramIdeGeprov' con el nuevo valor de 'ide_geprov'.
    setParamIdeGeprov({ ide_geprov: Number(newIdeGeprov) });
    droCantones.onRefresh();
  }, [droCantones, setValue]);

  /**
    * Llama al servicio web para obtner el proximo secuencial de la tabla
    * @returns
    */
  const callSequenceTableService = async (): Promise<number> => getSeqTable(tableName, primaryKey, 1);


  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{isUpdate ? 'Actualizar Dirección' : 'Nueva Dirección'}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Dropdown name="ide_getidi" label="Tipo de Dirección" useDropdown={droTipoDireccion} />
              <Field.Text name="nombre_dir_gedirp" label="Nombre" />
              <Field.Dropdown name="ide_geprov" label="Provincia" useDropdown={droProvincias} onChange={handleChangeProvincia} />
              <Field.Dropdown name="ide_gecant" label="Cantón" useDropdown={droCantones} />
            </Box>

            <Field.Text name="direccion_gedirp" label="Dirección" />
            <Field.Text name="referencia_gedirp" label="Referencia" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >

              <Field.Text name="telefono_gedirp" label="Teléfono" />
              <Field.Text name="movil_gedirp" label="Celular" />

            </Box>
            <Field.Checkbox name="defecto_gedirp" label="Usar esta dirección como predeterminada." />
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
