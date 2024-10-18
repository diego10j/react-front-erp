import type {
  SelectChangeEvent
} from '@mui/material';

import { useCallback, useState, useEffect, useMemo, memo } from 'react';

import {
  Box, Card, CardHeader, Dialog, Button,
  Select, Checkbox, MenuItem, Divider, InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  Stack,
  FormControlLabel
} from '@mui/material';

import { toast } from 'src/components/snackbar';

import { SelectEmpresa } from './SelectEmpresa';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover } from 'src/components/custom-popover';
import { getEmpresas, getSucursales, getPerfiles } from '../../../api/sistema';
import { useSettingsContext } from 'src/components/settings';
// ----------------------------------------------------------------------


export default function SelectRol() {

  const settings = useSettingsContext();

  const empresas = useMemo(() => getEmpresas(), []);
  const sucursales = useMemo(() => getSucursales(), []);
  const perfiles = useMemo(() => getPerfiles(), []);

  const [selection, setSelection] = useState({
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

  const handleAceptar = useCallback(() => {
    const { empresa, sucursal, perfil } = selection;
    if (empresa && sucursal && perfil) {
      settings.onUpdateField('empresa', empresa);
      settings.onUpdateField('sucursal', sucursal);
      settings.onUpdateField('perfil', perfil);
      settings.onCloseSelectRol();
      // Realizar acciones adicionales
    } else {
      toast.warning('Seleccione una empresa, una sucursal y un rol');
    }
  }, [selection]);


  const handleClose = useCallback(() => {
    const { empresa, sucursal, perfil } = selection;
    if (empresa && sucursal && perfil) {
      settings.onCloseSelectRol();
    } else {
      toast.warning('Seleccione una empresa, una sucursal y un rol');
    }
  }, [selection]);


  return (
    <Dialog open={settings.openSelectRol} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Personalizar Columna</DialogTitle>
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
        <Card>
          <CardHeader title="Roles" subheader="Seleccione un rol" sx={{ mb: 1 }} />
          <Scrollbar sx={{ minHeight: 200, maxHeight: 200 }}>
            <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} sx={{ minWidth: 560 }}>
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
        </Card>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button onClick={handleAceptar} color="primary">
          Guardar
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
        pl: 2,
        pr: 1,
        py: 1.5,
        display: 'flex',
        ...(checked && { color: 'text.disabled', textDecoration: 'line-through' }),
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            disableRipple
            checked={checked}
            onChange={onChange}
            inputProps={{
              name: item.name,
              'aria-label': 'Checkbox perfil',
            }}
          />
        }
        label={item.name}
      />
    </Box>
  );
}

type ItemProps = {
  item: any;
  checked: boolean;
  onChange: () => void;
};
