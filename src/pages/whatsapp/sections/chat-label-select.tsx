import type { IEtiquetasChat } from 'src/types/whatsapp';

import { useState } from 'react';

import {
    List, Dialog, Button, Radio,
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
    lists: IEtiquetasChat[];
    selectedLabel: number;
    onSave: (label: number, color: string) => void;
};

export function ChatLabelSelect({ open, onClose, lists, selectedLabel, onSave }: Props) {
    // Estado para almacenar la opción seleccionada
    const [selected, setSelected] = useState<IEtiquetasChat>({
        ide_wheti: selectedLabel,
        nombre_wheti: '',
        color_wheti: ''
    });

    // Maneja el cambio de selección
    const handleToggle = (value: IEtiquetasChat) => () => {
        setSelected(value);
    };

    // Guarda la selección y cierra el diálogo
    const handleSave = () => {
        if (selectedLabel !== selected?.ide_wheti)
            onSave(selected.ide_wheti, selected.color_wheti);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" PaperProps={{ style: { minWidth: 350 } }}>
            <DialogTitle>Seleccionar Etiqueta </DialogTitle>
            <DialogContent>
                <List>
                    {lists.map((item) => (
                        <ListItem key={item.ide_wheti} >
                            <Iconify icon="eva:pricetags-fill" sx={{ ml: 1, width: 16, height: 16, mr: 1, color: `${item.color_wheti}` }} />
                            <ListItemText primary={item.nombre_wheti} />
                            <ListItemSecondaryAction>
                                <Radio
                                    edge="end"
                                    onChange={handleToggle(item)}
                                    checked={selected?.ide_wheti === item.ide_wheti} // Compara con el valor seleccionado
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