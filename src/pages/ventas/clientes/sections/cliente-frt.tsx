import type { IideGeprov } from 'src/types/sistema/general';

import { z as zod } from 'zod';
import { useMemo, useState, useCallback, useEffect } from "react";

import { Box, Card, Grid, Stack, Radio, FormLabel, CardHeader, Typography, RadioGroup, FormControl, InputAdornment, FormControlLabel } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import FormTable from 'src/core/components/form';
import { useDropdown } from 'src/core/components/dropdown';
import { SubmitButton } from 'src/core/components/form/SubmitButton';
import { MenuToolbar } from 'src/core/components/menu-toolbar/menu-toolbar';
import { MailIcon, MovilIcon, PhoneIcon, PersonIcon } from 'src/core/components/icons/CommonIcons';
import { useGetListDataCantones, useGetListDataProvincias, useGetListDataTipoIdentificacion } from 'src/api/sistema/general';
import { useGetListDataVendedores, useGetListDataTipoContribuyente, useGetListDataFormasPagoCliente } from 'src/api/ventas/clientes';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import type { CustomColumn } from '../../../../core/types/customColumn';
import type { UseFormTableReturnProps } from '../../../../core/components/form/types';
// ----------------------------------------------------------------------

const TIPO_PERSONA_DEFAULT = "1"; // Persona natural
// esquema de validaciones
export const FromTableSchema = zod.object({
  nom_geper: zod.string().min(1, { message: 'El nombre es obligatorio!' }),
});


type Props = {
  useFormTable: UseFormTableReturnProps;
};

export default function ClienteFRT({ useFormTable }: Props) {

  const [tipoPersona, setTipoPersona] = useState(TIPO_PERSONA_DEFAULT);

  const customColumns: CustomColumn[] = useMemo(() => [
    {
      name: 'activo_geper', defaultValue: true,
    },
    {
      name: 'ide_getip', defaultValue: TIPO_PERSONA_DEFAULT,
    },


  ], []);

  const mdUp = useResponsive('up', 'md');

  const drwVendedores = useDropdown({ config: useGetListDataVendedores() });
  const drwTipoIdentificacion = useDropdown({ config: useGetListDataTipoIdentificacion() })
  const drwTipoContribuyente = useDropdown({ config: useGetListDataTipoContribuyente() })
  const drwProvincias = useDropdown({ config: useGetListDataProvincias() });
  const drwFormaPagos = useDropdown({ config: useGetListDataFormasPagoCliente() });



  const [paramIdeGeprov, setParamIdeGeprov] = useState<IideGeprov>(
    {
      ide_geprov: -1
    }
  );

  const drwCantones = useDropdown({ config: useGetListDataCantones(paramIdeGeprov) });

  useEffect(() => {
    if (useFormTable.initialize === true) {
      if (useFormTable.getValue('ide_getip')) {
        setTipoPersona(useFormTable.getValue('ide_getip'));
      }
    }
  }, [useFormTable, useFormTable.initialize]);


  const handleChangeTipoPersona = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTipoPersona((event.target as HTMLInputElement).value);
  };


  /**
   * Cuando selecciona una provincia carga sus cantones
   */
  const handleChangeProvincia = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Obtén el valor actual de 'ide_geprov' desde el formulario.
    const newIdeGeprov = event.target.value;
    useFormTable.setValue('ide_geprov', newIdeGeprov);
    // Set null a Canton
    useFormTable.setValue('ide_gecant', '');
    // Actualiza el estado 'paramIdeGeprov' con el nuevo valor de 'ide_geprov'.
    setParamIdeGeprov({ ide_geprov: Number(newIdeGeprov) });
    drwCantones.onRefresh();
  }, [drwCantones, useFormTable]);



  const renderDetails = (
    <>

      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Información del Cliente
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Administra Datos del Cliente, Código, Tipo de Persona, Razón Social
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Información del Cliente" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5} direction="row" >

              <FormControl>
                <FormLabel id="tipo-persona">Tipo de Persona</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="radio-tipo-persona"
                  name="controlled-radio-tipo-persona"
                  value={tipoPersona}
                  onChange={handleChangeTipoPersona}
                  sx={{ gap: 4 }}
                >
                  <FormControlLabel value="1" control={<Radio />} label="Persona Natural" />
                  <FormControlLabel value="2" control={<Radio />} label="Persona Jurídica" />
                </RadioGroup>
              </FormControl>
              <Box sx={{ flexGrow: 1 }} />
              <Iconify icon={tipoPersona === '1' ? 'fluent:person-24-regular' : 'fluent:building-people-24-regular'} width={32} />


            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Dropdown name="ide_getid" label="Tipo Identificación" useDropdown={drwTipoIdentificacion} />
              <Field.Text name="identificac_geper" label="Identificación" />

            </Box>


            <Field.Text
              name="nom_geper"
              label={tipoPersona === '1' ? 'Apellidos y Nombres' : 'Razón Social'}
              placeholder={tipoPersona === '1' ? 'Ejemplo: LOPEZ PEREZ JUAN LUIS' : ''}
              InputLabelProps={{ shrink: true }}
            />


            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Dropdown name="ide_cntco" label="Tipo Contribuyente" useDropdown={drwTipoContribuyente} />
              <Field.Text name="codigo_geper" label="Código" />
            </Box>

            <Field.Text name="nombre_compl_geper" label="Nombre comercial" />


            {tipoPersona !== '1' && (
              <Field.Text name="repre_legal_geper" label="Representante Legal" />
            )}

            <Field.Switch name="activo_geper" label="Activo" sx={{ m: 0 }} />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderContact = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Información de Contacto
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ingresa dirección, correo electrónico, teléfono
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Información de Contacto" />}

          <Stack spacing={3} sx={{ p: 3 }}>


            <Field.Text
              name="contacto_geper"
              label="Contacto"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Field.Text
              name="correo_geper"
              label="Email"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ color: 'text.secondary' }}>
                    <MailIcon />
                  </InputAdornment>
                ),
              }}
            />


            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Dropdown name="ide_geprov" label="Provincia" useDropdown={drwProvincias} onChange={handleChangeProvincia} />
              <Field.Dropdown name="ide_gecant" label="Cantón" useDropdown={drwCantones} />


            </Box>


            <Field.Text name="direccion_geper" label="Dirección" />
            <Field.Text name="numero_geper" label="Referencia" />

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <Field.Text
                name="telefono_geper"
                label="Télefono Fijo"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                      <PhoneIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Field.Text
                name="movil_geper"
                label="Télefono Movil"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start" sx={{ color: 'text.secondary' }}>
                      <MovilIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );


  const renderCredit = (
    <>
      {mdUp && (
        <Grid item md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Forma de Pago
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Ingresa vendedor, forma de pago y límites de crédito
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Forma de Pago" />}

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
              <Field.Dropdown name="ide_cntco" label="Vendedor" useDropdown={drwVendedores} />
              <Field.Dropdown name="ide_cntco" label="Forma de Pago" useDropdown={drwFormaPagos} />

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
              <Field.Text
                name="dias_credito_geper"
                label="Días de crédito"
              />
              <Field.Text
                name="limite_credito_geper"
                label="Límite de crédito"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        $
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

            </Box>

            <Field.Text name="observacion_geper" label="Observaciones" multiline rows={4} />


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

        {renderContact}

        {renderCredit}



      </Grid>


    </FormTable >


  );


}
