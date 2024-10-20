
import type {
  SelectChangeEvent
} from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';

import { memo, useMemo, useState, useEffect, forwardRef, useCallback } from 'react';

import {
  Box, Stack, Slide, Dialog,
  Button, Select, Divider, Checkbox, MenuItem,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormControlLabel
} from '@mui/material';

import { getMenuByRol, validarHorarioLogin } from 'src/api/auth/auth';

import { toast } from 'src/components/snackbar';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover } from 'src/components/custom-popover';
import { useSettingsContext } from 'src/components/settings';

import { SelectEmpresa } from './SelectEmpresa';
import { getIdeUsua, getEmpresas, getPerfiles, getSucursales } from '../../../api/sistema';
// ----------------------------------------------------------------------

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default function SelectRol() {

  const settings = useSettingsContext();

  const empresas = useMemo(() => getEmpresas(), []);
  const sucursales = useMemo(() => getSucursales(), []);
  const perfiles = useMemo(() => getPerfiles(), []);

  const [selection, setSelection] = useState<{ empresa: any, sucursal: any, perfil: any }>({
    empresa: null,
    sucursal: null,
    perfil: null
  });

  const popover = usePopover();

  useEffect(() => {
    // Valores iniciales
    if (empresas.length === 1) {
      updateState('empresa', empresas[0]);
    }
    if (sucursales.length === 1) {
      updateState('sucursal', sucursales[0]);
    }
  }, [empresas, sucursales]);


  const updateState = (field: string, value: any) => {
    setSelection(prev => ({ ...prev, [field]: value }));
  };

  const handleChangeEmpresa = useCallback(
    (newValue: any) => {
      updateState('empresa', newValue);
      popover.onClose();
    },
    [popover]
  );

  const handleChangeSucursal = useCallback(
    (event: SelectChangeEvent<any>) => {
      updateState('sucursal', event.target.value);
    },
    []
  );


  const handleChangePerfil = useCallback(
    (perfil: any) => {
      updateState('perfil', perfil);
    },
    []
  );

  const handleAceptar = useCallback(async () => {
    const { empresa, sucursal, perfil } = selection;
    if (empresa && sucursal && perfil) {


      try {
        // Valida horario de rol
        await validarHorarioLogin({
          ide_usua: getIdeUsua(),
          ide_perf: Number(perfil?.ide_perf),
          nom_perf: perfil?.nom_perf,
        });
        settings.onUpdateField('empresa', empresa);
        settings.onUpdateField('sucursal', sucursal);
        settings.onUpdateField('perfil', perfil);
        // obtiene roles
        const dataMenu = await getMenuByRol({
          ide_perf: Number(perfil?.ide_perf)
        });
        settings.onUpdateField('menu', dataMenu.data);
        settings.onCloseSelectRol();

      } catch (error) {
        toast.error(error.message);
      }
      // Realizar acciones adicionales
    } else {
      toast.warning('Seleccione una empresa, una sucursal y un rol');
    }
  }, [selection, settings]);


  const handleClose = useCallback(() => {
    const { empresa, sucursal, perfil } = settings;
    if (empresa && sucursal && perfil) {
      settings.onCloseSelectRol();
    } else {
      toast.warning('Seleccione una empresa, una sucursal y un rol');
    }
  }, [settings]);


  return (
    <Dialog
      open={settings.openSelectRol}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>Seleccionar Rol</DialogTitle>
      <DialogContent>
        {/* -- Empresa -- */}
        <SelectEmpresa
          popover={popover}
          empresa={selection.empresa}
          onChange={handleChangeEmpresa}
          data={empresas}
        />
        {/* -- Sucursal -- */}
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="sucursal">Sucursal</InputLabel>
          <Select
            value={selection.sucursal || ''}
            label="Sucursal"
            onChange={handleChangeSucursal}
          >
            {sucursales.map((option) => (
              <MenuItem key={option.ide_sucu} value={option}>
                {option.nom_sucu}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* -- Roles/Perfiles -- */}
        <Box sx={{
          borderRadius: 2,
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`
        }}>
          <Scrollbar sx={{ maxHeight: 200 }}>
            <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ minWidth: 300 }}>
              {perfiles.map((item) => (
                <MemoizedItem
                  key={item.ide_perf}
                  item={item}
                  checked={selection.perfil === item}
                  onChange={() => handleChangePerfil(item)}
                />
              ))}
            </Stack>
          </Scrollbar>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleAceptar} variant='contained' color="primary" autoFocus>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

const MemoizedItem = memo(Item);

function Item({ item, checked, onChange }: ItemProps) {
  return (
    <Box
      sx={{
        px: 3,
        py: 1,
        display: 'flex',
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            disableRipple
            checked={checked}
            onChange={onChange}
            inputProps={{
              name: item.nom_perf,
              'aria-label': 'Checkbox perfil',
            }}
          />
        }
        label={item.nom_perf}
      />
    </Box>
  );
}

type ItemProps = {
  item: any;
  checked: boolean;
  onChange: () => void;
};
