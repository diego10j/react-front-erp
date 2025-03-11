import type { IGetMensajes, IListChat } from 'src/types/whatsapp';

import { useEffect, useState } from 'react';

import {
  List, Dialog, Button, Checkbox,
  ListItem,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemSecondaryAction
} from '@mui/material';

import { toast } from 'src/components/snackbar';

import { Iconify } from 'src/components/iconify';
import { saveListasContacto, useGetListasContacto } from 'src/api/whatsapp';

type Props = {
  open: boolean;
  paramGetMensajes: IGetMensajes,
  onClose: () => void;
  lists: IListChat[];
};

export function ChatListAdd({ open, paramGetMensajes, onClose, lists, }: Props) {

  const {
    dataResponse,
    isLoading,
    //  mutate
  } = useGetListasContacto(paramGetMensajes);

  const [selected, setSelected] = useState<number[]>([]);


  useEffect(() => {
    setSelected(dataResponse)
  }, [dataResponse]);

  const handleToggle = (value: number) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  const handleSave = async () => {
    try {
      await saveListasContacto({
        listas: selected,
        telefono: paramGetMensajes.telefono
      });
      toast.success(`Datos guardados exitosamente`);
    } catch (error) {
      toast.error(`Error al guardar ${error}`);
    }
    finally {
      onClose();
    }

  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" PaperProps={{ style: { minWidth: 350 } }}>
      <DialogTitle>Agrega a listas</DialogTitle>
      <DialogContent>
        <List>
          {lists.filter((item) => item.ide_whlis !== -1 && item.ide_whlis !== -2 && item.ide_whlis !== -3).map((item) => (
            <ListItem key={item.ide_whlis} >
              {item.icono_whlis && (
                <Iconify icon={item.icono_whlis} sx={{ ml: 1, width: 16, height: 16, mr: 1 }} />
              )}
              <ListItemText primary={item.nombre_whlis} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  disabled={isLoading}
                  onChange={handleToggle(item.ide_whlis)}
                  checked={selected.indexOf(item.ide_whlis) !== -1}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
