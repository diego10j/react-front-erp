import type { IListChat } from 'src/types/whatsapp';

import { useState } from 'react';

import {
  List, Dialog, Button, Checkbox,
  ListItem,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemSecondaryAction
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (selectedItems: number[]) => void;
  lists: IListChat[];
  selectedItems: number[];
};

export function ChatListAdd({ open, onClose, onSave, lists, selectedItems }: Props) {


  const [selected, setSelected] = useState<number[]>(selectedItems);

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

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md"  PaperProps={{ style: { minWidth: 350 } }}>
      <DialogTitle>Agrega a listas</DialogTitle>
      <DialogContent>
        <List>
          {lists.filter(item => item.ide_whlis !== -1).map((item) => (
            <ListItem key={item.ide_whlis} onClick={handleToggle(item.ide_whlis)}>
              {item.icono_whlis && (
                <Iconify icon={item.icono_whlis} sx={{ ml: 1, width: 16, height: 16, mr: 1 }} />
              )}
              <ListItemText primary={item.nombre_whlis} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
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
