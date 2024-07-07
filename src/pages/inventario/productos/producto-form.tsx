// types
import type { ISave } from 'src/types/core';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { save, getSeqTable } from 'src/api/core';
import { sendUploadImage } from 'src/api/upload';
import { useDropdown } from 'src/core/components/dropdown';
import { useListDataCategorias, useListDataAreasAplica, useListDataUnidadesMedida } from 'src/api/productos';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const SchemaProducto = zod.object({
  ide_inarti: zod.number().nullable(),
  nombre_inarti: zod.string().min(1, { message: 'Nombre es obligatorio!' }).nullable(),
  codigo_inarti: zod.string().min(1, { message: 'Código es obligatorio!' }).nullable(),
  ide_incate: schemaHelper.number({ message: { required_error: `Categoríaes obligatorio!` } }).nullable(),
  foto_inarti: zod.any().nullable(),
  tags_inarti: zod.array(zod.any()).min(1, { message: 'Debe seleccionar al menos 1 Uso' }).nullable(),
  ide_inuni: schemaHelper.number({ message: { required_error: `Unidad de medida obligatorio!` } }).nullable(),
  observacion_inarti: zod.string().nullable(),
  publicacion_inarti: zod.string().nullable(),
  iva_inarti: zod.number().nullable(),
  activo_inarti: zod.boolean().nullable(),
  ice_inarti: zod.boolean().nullable(),
  hace_kardex_inarti: zod.boolean().nullable(),
  es_combo_inarti: zod.boolean().nullable(),
  cant_stock1_inarti: schemaHelper.number().nullable(),
  cant_stock2_inarti: schemaHelper.number().nullable(),
  por_util1_inarti: schemaHelper.number().nullable(),
  por_util2_inarti: schemaHelper.number().nullable(),
  inv_ide_inarti: schemaHelper.number().nullable(),
  ide_intpr: schemaHelper.number().nullable(),
  nivel_inarti: zod.string().nullable(),
  iva: zod.boolean().nullable(),
});

type IProducto = zod.infer<typeof SchemaProducto>;

type Props = {
  currentProducto?: IProducto;
};


const tableName = 'inv_articulo';
const primaryKey = 'ide_inarti';
const INV_IDE_INARTI = 46;     //* TODO Variable de sistema */
const IDE_INTPR = 1;           //* TODO Variable de sistema */
const NIVEL_INARTI = 'HIJO';   //* TODO Variable de sistema */
const UTILIDAD_POR_MAYOR = 30; //* TODO Variable de sistema */
const UTILIDAD_POR_MENOR = 45; //* TODO Variable de sistema */

export default function ProductoForm({ currentProducto }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const drwCategorias = useDropdown({ config: useListDataCategorias() });
  const drwUnidadesM = useDropdown({ config: useListDataUnidadesMedida() });
  const drwAreaAplica = useDropdown({ config: useListDataAreasAplica() });

  const defaultValues = useMemo(
    () => ({
      ide_inarti: currentProducto?.ide_inarti || null,
      nombre_inarti: currentProducto?.nombre_inarti || '',
      codigo_inarti: currentProducto?.codigo_inarti || '',
      ide_incate: currentProducto?.ide_incate || '',
      foto_inarti: currentProducto?.foto_inarti || null,
      tags_inarti: currentProducto?.tags_inarti || [],
      ide_inuni: currentProducto?.ide_inuni || '',
      observacion_inarti: currentProducto?.observacion_inarti || '',
      publicacion_inarti: currentProducto?.publicacion_inarti || '',
      iva_inarti: currentProducto?.iva_inarti || null,
      activo_inarti: currentProducto?.activo_inarti || true,
      ice_inarti: currentProducto?.ice_inarti || false,
      hace_kardex_inarti: currentProducto?.hace_kardex_inarti || true,
      es_combo_inarti: currentProducto?.es_combo_inarti || false,
      cant_stock1_inarti: currentProducto?.cant_stock1_inarti || null,
      cant_stock2_inarti: currentProducto?.cant_stock2_inarti || null,
      por_util1_inarti: currentProducto?.por_util1_inarti || UTILIDAD_POR_MENOR,
      por_util2_inarti: currentProducto?.por_util2_inarti || UTILIDAD_POR_MAYOR,
      inv_ide_inarti: currentProducto?.inv_ide_inarti || INV_IDE_INARTI,
      ide_intpr: currentProducto?.ide_intpr || IDE_INTPR,
      nivel_inarti: currentProducto?.nivel_inarti || NIVEL_INARTI,
      iva: currentProducto?.iva_inarti === 0 ? false : true || true, // campo externo para guradar si graba iva o no
    }),
    [currentProducto]
  );

  const methods = useForm<IProducto>({
    mode: 'all',
    resolver: zodResolver(SchemaProducto),
    defaultValues,
  });


  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentProducto) {
      reset(defaultValues);
    }
  }, [currentProducto, defaultValues, reset]);


  const onSubmit = handleSubmit(async (data) => {

    try {
      const objectData: any = data;
      objectData[primaryKey] = currentProducto ? objectData[primaryKey] : await getSeqTable(tableName, primaryKey, 1);
      objectData.tags_inarti = JSON.stringify(objectData.tags_inarti);
      objectData.iva_inarti = objectData.iva === true ? 1 : 0;
      delete objectData.iva

      if (currentProducto) {
        objectData.fecha_actua = null;
        objectData.hora_actua = null;
        objectData.usuario_actua = null;
      }
      else {
        objectData.fecha_ingre = null;
        objectData.hora_ingre = null;
        objectData.usuario_ingre = null;
        objectData.ide_empr = null;
        objectData.ide_sucu = null;
      }
      const param: ISave = {
        listQuery: [{
          tableName,
          primaryKey,
          object: objectData,
          operation: currentProducto ? 'update' : 'insert'
        }]
      };
      await save(param);
      reset();
      toast.success(currentProducto ? 'Actualizado con exito!' : 'Creado con exito!');
      router.push(paths.dashboard.inventario.productos.list);
    } catch (error) {
      toast.error(currentProducto ? `No se pudo Actualizar, ${error}` : `No se pudo Crear, ${error}`);
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        const data = await sendUploadImage(newFile);
        // setValue('foto_inarti', newFile, { shouldValidate: true });
        setValue('foto_inarti', data);
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('foto_inarti', null);
  }, [setValue]);


  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Título, código, breve descripción, imagen...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="codigo_inarti" label="Código" disabled={currentProducto === null} />
              <Field.Dropdown name="ide_incate" label="Categoría" useDropdown={drwCategorias} />

            </Box>

            <Field.Text name="nombre_inarti" label="Nombre del Producto" />
            <Field.Text name="observacion_inarti" label="Descripción" multiline rows={4} />
            <Field.Switch name="activo_inarti" label="Activo" sx={{ m: 0 }} />

            <Field.Autocomplete
              name="tags_inarti"
              label="Usos"
              placeholder="+ Usos"
              multiple
              freeSolo
              options={drwAreaAplica.options.map((option) => option)}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.value}
                    label={option.label}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Imagen</Typography>
              <Field.UploadBox
                name="foto_inarti"
                apiUpload
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Contenido</Typography>
              <Field.Editor name="publicacion_inarti" placeholder="Escribe información acerca del producto..." />
            </Stack>

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Precios y Stock
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Configuración de precios, utilidad, unidad de medida y stock
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Precios y Stock" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Switch name="iva" label="Grava I.V.A" sx={{ m: 0 }} />
              <Field.Switch name="ice_inarti" label="Grava I.C.E" sx={{ m: 0 }} />
              <Field.Text
                name="por_util1_inarti"
                label="Utilidad venta al por menor (%)"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Field.Text
                name="por_util2_inarti"
                label="Utilidad venta al por mayor (%)"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Inventario</Typography>

              <Field.Dropdown name="ide_inuni" label="Unidad de Medida" useDropdown={drwUnidadesM} />


              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Field.Text name="cant_stock1_inarti" label="Stock Mínimo" placeholder="0" type="number" />
                <Field.Text name="cant_stock2_inarti" label="Stock Ideal" placeholder="0" type="number" />
              </Box>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProducto ? 'Crear Producto' : 'Guardar Cambios'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderPricing}

        {renderActions}
      </Grid>
    </Form>
  );
}
