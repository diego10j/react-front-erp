import { z as zod } from 'zod';
import { useMemo } from "react";

import { Box, Card, Chip, Grid, Stack, CardHeader, Typography, InputAdornment } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import FormTable from 'src/core/components/form';
import { useDropdown } from 'src/core/components/dropdown';
import { SubmitButton } from 'src/core/components/form/SubmitButton';
import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';

import { Field } from 'src/components/hook-form';

import { useListDataCategorias, useListDataAreasAplica, useListDataUnidadesMedida } from '../../../../api/inventario/productos';

import type { CustomColumn } from '../../../../core/types/customColumn';
import type { UseFormTableReturnProps } from '../../../../core/components/form/types';
// ----------------------------------------------------------------------

// esquema de validaciones
export const FromTableSchema = zod.object({
  tags_inarti: zod.array(zod.any()).min(1, { message: 'Debe seleccionar al menos 1 Uso' }).nullable(),
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


  const renderDetails = (
    <>

      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Título, código, breve descripción, imagen...
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
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
              <Field.Text name="codigo_inarti" label="Código" disabled={!useFormTable.isUpdate} />
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
              <Field.UploadImage
                thumbnail
                name="foto_inarti"
                maxSize={3145728}
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
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Precios y Stock
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Configuración de precios, utilidad, unidad de medida y stock
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
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

      <MenuToolbar>
        {renderActions}
      </MenuToolbar>
      <Grid container spacing={3} sx={{ pt: 1 }}>
        {renderDetails}

        {renderPricing}


      </Grid>


    </FormTable >


  );


}
