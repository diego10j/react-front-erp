import { z as zod } from 'zod';
import { useMemo, useCallback } from "react";

import { Box, Card, Chip, Grid, Stack, CardHeader, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import FormTable from 'src/core/components/form';
import { removeUrlImagen } from 'src/api/sistema/files';
import { useDropdown } from 'src/core/components/dropdown';
import { useGetListDataBodegas } from 'src/api/inventario/bodegas';
import { SubmitButton } from 'src/core/components/form/SubmitButton';
import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';

import { Field, schemaHelper } from 'src/components/hook-form';

import { useListDataCategorias, useListDataAreasAplica, useListDataUnidadesMedida } from '../../../../api/inventario/productos';

import type { CustomColumn } from '../../../../core/types/customColumn';
import type { UseFormTableReturnProps } from '../../../../core/components/form/types';
// ----------------------------------------------------------------------

const BODEGA_DEFAULT = "2";
// esquema de validaciones
export const FromTableSchema = zod.object({
  tags_inarti: zod.array(zod.any()).min(1, { message: 'Debe seleccionar al menos 1 Línea de negocio' }).nullable(),
  fotos_inarti: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
});


type Props = {
  useFormTable: UseFormTableReturnProps;
};

export default function ProductoFRT({ useFormTable }: Props) {


  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'ide_inarti', visible: false,
    },
  ], []);

  const mdUp = useResponsive('up', 'md');

  const drwCategorias = useDropdown({ config: useListDataCategorias() });
  const drwUnidadesM = useDropdown({ config: useListDataUnidadesMedida() });
  const drwAreaAplica = useDropdown({ config: useListDataAreasAplica() });

  const drwBodegas = useDropdown({ config: useGetListDataBodegas(), defaultValue: BODEGA_DEFAULT })


  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const fotosInarti = useFormTable.getValue('fotos_inarti') || [];
      const nombreImagen = removeUrlImagen(`${inputFile}`);
      const filtered = fotosInarti.filter((file: string | File) => file !== nombreImagen);
      useFormTable.setValue('fotos_inarti', filtered);
      useFormTable.setValue('foto_inarti', filtered[0] || null);
    },
    [useFormTable]
  );


  const handleRemoveAllFiles = useCallback(() => {
    useFormTable.setValue('fotos_inarti', []);
    useFormTable.setValue('foto_inarti', null);
  }, [useFormTable]);

  const handleDrop = useCallback(() => {
    const files = useFormTable.getValue('fotos_inarti') || [];
    useFormTable.setValue('foto_inarti', files[0] || null);
  }, [useFormTable]);

  const renderDetails = (
    <>

      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles del Producto
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Visualiza y Administra Título, Código, Categoría e Imágenes
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles del Producto" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Field.Switch name="activo_inarti" label="Activo" sx={{ m: 0 }} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="codigo_inarti" label="Código" disabled={useFormTable.isUpdate} />
              <Field.Dropdown name="ide_incate" label="Categoría" useDropdown={drwCategorias} />

            </Box>

            <Field.Text name="nombre_inarti" label="Nombre del producto" />



            <Field.Text name="otro_nombre_inarti" label="Otros nombres" />

            <Field.Autocomplete
              name="tags_inarti"
              label="Líneas de negocio"
              placeholder="+ Líneas de negocio"
              multiple
              options={drwAreaAplica.options}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
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
                    color="primary"
                    variant="soft"
                  />
                ))
              }
            />



            <Stack spacing={1.5}>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Field.Switch name="se_vende_inarti" label="Se vende" sx={{ m: 0 }} />
                <Field.Switch name="se_compra_inarti" label="Se compra" sx={{ m: 0 }} />
              </Box>

              <Typography variant="subtitle2">Fotos</Typography>
              <Field.Upload
                multiple
                thumbnail
                name="fotos_inarti"
                maxSize={3145728}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
                onDrop={handleDrop}
              />
            </Stack>
            <Field.Text name="observacion_inarti" label="Observaciones" multiline rows={4} />







          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Configuración de Inventario
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Establece Unidades, Niveles Mínimos de Stock y Bodega Predeterminada
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Configuración de Inventario" />}

          <Stack spacing={3} sx={{ p: 3 }}>

            <Field.Switch name="hace_kardex_inarti" label="Controlar Inventario" sx={{ m: 0 }} />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <Field.Dropdown name="ide_inbod" label="Bodega por defecto" useDropdown={drwBodegas} />
              <Field.Text name="cod_barras_inarti" label="Código de Barras" />

            </Box>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Dropdown name="ide_inuni" label="Unidad de Medida" useDropdown={drwUnidadesM} />
              <Field.Switch name="iva" label="Grava I.V.A" sx={{ m: 0 }} />
            </Box>

            <Stack spacing={1}>


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


  const renderContent = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles del Contenido
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gestiona la Publicación del Producto en el E-commerce
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles del Contenido" />}

          <Stack spacing={3} sx={{ p: 3 }}>

            <Field.Switch name="publicado_inarti" label="Publicado" sx={{ m: 0 }} />

            <Field.Text name="desc_corta_inarti" label="Descripción corta" multiline rows={4} />



            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Contenido</Typography>
              <Field.Editor name="publicacion_inarti" placeholder="Escribe información acerca del producto..." />
            </Stack>
          </Stack>
        </Card>
      </Grid>



    </>
  );

  const renderActions = (
    <>
      <SubmitButton
        loading={useFormTable.isSubmitting()}
        isUpdate={useFormTable.isUpdate}
        disabled={!useFormTable.isChangeDetected}
      />
      {useFormTable.renderOptionsForm()}
    </>
  );


  return (


    <FormTable
      ref={useFormTable.formRef}
      useFormTable={useFormTable}
      schema={FromTableSchema}
      customColumns={customColumns}
    >

      <MenuToolbar sticky>
        {renderActions}
      </MenuToolbar>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        {renderDetails}

        {renderPricing}

        {renderContent}


      </Grid>


    </FormTable >


  );


}
