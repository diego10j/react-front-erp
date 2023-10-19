import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

// services
import { useDropdown } from '../../core/components/dropdown';
import { sendPost } from '../../core/services/serviceRequest';
import { getSeqTable } from '../../services/core/serviceSistema';
import { sendUploadImage } from '../../services/core/serviceUpload';
import { getListCategoria, getListUnidadesM, getListAreaAplica } from '../../services/core/serviceProducto';

// ----------------------------------------------------------------------

const SchemaProducto = Yup.object().shape({
  ide_inarti: Yup.number().nullable(),
  nombre_inarti: Yup.string().required('Nombre es obligatorio'),
  codigo_inarti: Yup.string().required('Código es obligatorio'),
  ide_incate: Yup.string().required('Categoría es obligatorio'),
  foto_inarti: Yup.mixed<any>().nullable(),
  tags_inarti: Yup.array().min(1, 'Debe seleccionar almenos 1 Uso').nullable(),
  ide_inuni: Yup.string().required('Unidad de medida es obligatorio'),
  observacion_inarti: Yup.string().nullable(),
  publicacion_inarti: Yup.string().nullable(),
  iva_inarti: Yup.boolean().nullable(),
  activo_inarti: Yup.boolean().nullable(),
  ice_inarti: Yup.boolean().nullable(),
  hace_kardex_inarti: Yup.boolean().nullable(),
  es_combo_inarti: Yup.boolean().nullable(),
  cant_stock1_inarti: Yup.number().nullable(),
  cant_stock2_inarti: Yup.number().nullable(),
  por_util1_inarti: Yup.number().nullable(),
  por_util2_inarti: Yup.number().nullable(),
  inv_ide_inarti: Yup.number().nullable(),
  ide_intpr: Yup.number().nullable(),
  nivel_inarti: Yup.string().nullable(),
});

type IProducto = Yup.InferType<typeof SchemaProducto>;

type Props = {
  currentProducto?: IProducto;
};


export default function ProductoForm({ currentProducto }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const tableName = 'inv_articulo';
  const primaryKey = 'ide_inarti';
  const INV_IDE_INARTI = 46;     //* TODO Variable de sistema */
  const IDE_INTPR = 1;           //* TODO Variable de sistema */
  const NIVEL_INARTI = 'HIJO';   //* TODO Variable de sistema */
  const UTILIDAD_POR_MAYOR = 30; //* TODO Variable de sistema */
  const UTILIDAD_POR_MENOR = 45; //* TODO Variable de sistema */

  const droCategorias = useDropdown({ config: getListCategoria() });
  const droUnidadesM = useDropdown({ config: getListUnidadesM() });
  const droAreaAplica = useDropdown({ config: getListAreaAplica() });



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
      iva_inarti: currentProducto?.iva_inarti || false,
      activo_inarti: currentProducto?.activo_inarti || true,
      ice_inarti: currentProducto?.ice_inarti || false,
      hace_kardex_inarti: currentProducto?.hace_kardex_inarti || true,
      es_combo_inarti: currentProducto?.es_combo_inarti || false,
      cant_stock1_inarti: currentProducto?.cant_stock1_inarti,
      cant_stock2_inarti: currentProducto?.cant_stock2_inarti,
      por_util1_inarti: currentProducto?.por_util1_inarti || UTILIDAD_POR_MENOR,
      por_util2_inarti: currentProducto?.por_util2_inarti || UTILIDAD_POR_MAYOR,
      inv_ide_inarti: currentProducto?.inv_ide_inarti || INV_IDE_INARTI,
      ide_intpr: currentProducto?.ide_intpr || IDE_INTPR,
      nivel_inarti: currentProducto?.nivel_inarti || NIVEL_INARTI,
    }),
    [currentProducto]
  );


  const methods = useForm({
    resolver: yupResolver(SchemaProducto),
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
      objectData.iva_inarti = objectData.iva_inarti === true ? 1 : 0;
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
      const param = {
        listQuery: [{
          tableName,
          primaryKey,
          object: objectData,
          operation: currentProducto ? 'update' : 'insert'
        }]
      }
      await sendPost('api/core/save', param);
      reset();
      enqueueSnackbar(currentProducto ? 'Actualizado con exito!' : 'Creado con exito!');
      router.push(paths.dashboard.productos.list);
    } catch (error) {
      enqueueSnackbar(currentProducto ? `No se pudo Actualizar, ${error}` : `No se pudo Crear, ${error}`, {
        variant: 'error',
      });
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
              <RHFTextField name="codigo_inarti" label="Código" />
              <RHFSelect name="ide_incate" label="Categoría" InputLabelProps={{ shrink: true }}>
                {droCategorias.options.map((option) => (
                  < MenuItem key={option.value} value={option.value} >
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <RHFTextField name="nombre_inarti" label="Nombre del Producto" />
            <RHFTextField name="observacion_inarti" label="Descripción" multiline rows={4} />
            <RHFSwitch name="activo_inarti" label="Activo" sx={{ m: 0 }} />

            <RHFAutocomplete
              name="tags_inarti"
              label="Usos"
              placeholder="+ Usos"
              multiple
              freeSolo
              options={droAreaAplica.options.map((option) => option)}
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
              <RHFUpload
                name="foto_inarti"
                maxSize={3145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Contenido</Typography>
              <RHFEditor simple name="publicacion_inarti" placeholder="Escribe información acerca del producto..." />
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
              <RHFSwitch name="iva_inarti" label="Grava I.V.A" sx={{ m: 0 }} />
              <RHFSwitch name="ice_inarti" label="Grava I.C.E" sx={{ m: 0 }} />
              <RHFTextField
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
              <RHFTextField
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

              <RHFSelect name="ide_inuni" label="Unidad de Medida" InputLabelProps={{ shrink: true }}>
                {droUnidadesM.options.map((option) => (
                  < MenuItem key={option.value} value={option.value} >
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="cant_stock1_inarti" label="Stock Mínimo" placeholder="0" type="number" />
                <RHFTextField name="cant_stock2_inarti" label="Stock Ideal" placeholder="0" type="number" />
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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
