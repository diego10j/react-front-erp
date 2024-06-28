import { useState, useEffect } from 'react';

import {
  List, Grid, Dialog, Button,
  Select, Checkbox, MenuItem, TextField, IconButton, InputLabel,
  DialogTitle,
  FormControl,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemButton,
  FormControlLabel
} from '@mui/material';

import { Column } from 'src/core/types';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
};


export default function ConfigDataTable({ open, onClose, columns, onColumnsChange }: Props) {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number>(-1);
  const [editedColumn, setEditedColumn] = useState<Column | null>(null);
  const [columnOrder, setColumnOrder] = useState(columns);

  useEffect(() => {
    if (open && columns.length > 0) {
      if (selectedColumnIndex === -1) {
        setSelectedColumnIndex(0);
        setEditedColumn({ ...columns[0] });
      }
      setColumnOrder(columns);
    }
  }, [columns, open, selectedColumnIndex]);



  const handleListItemClick = (index: number) => {
    setSelectedColumnIndex(index);
    setEditedColumn({ ...columnOrder[index] });
  };

  const handleInputChange = (field: keyof Column, value: any) => {
    if (editedColumn) {
      setEditedColumn({ ...editedColumn, [field]: value });
    }
  };

  const handleSave = () => {
    if (selectedColumnIndex !== null && editedColumn) {
      const updatedColumns = [...columnOrder];
      toast.success('Guardado con éxito');
      updatedColumns[selectedColumnIndex] = editedColumn;
      onColumnsChange(updatedColumns);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex >= 0 && toIndex < columnOrder.length && fromIndex !== toIndex) {
      const updatedColumns = [...columnOrder];

      // Actualizar el orden en la propiedad 'order'
      const movedItem = updatedColumns[fromIndex];
      updatedColumns.splice(fromIndex, 1);
      updatedColumns.splice(toIndex, 0, movedItem);

      // Reasignar el orden basado en la nueva posición
      updatedColumns.forEach((column, index) => {
        column.order = index;
      });

      setColumnOrder(updatedColumns);
      setSelectedColumnIndex(toIndex); // Mantener la selección del elemento movido
      onColumnsChange(updatedColumns);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Personalizar Columna</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4} style={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)', maxHeight: '70vh', overflow: 'auto' }}>
            <List>
              {columnOrder.map((column, index) => (
                <ListItemButton
                  key={column.name}
                  selected={index === selectedColumnIndex}
                  onClick={() => handleListItemClick(index)}
                >
                  <ListItemText primary={column.label} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={1} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              onClick={() => moveItem(selectedColumnIndex, selectedColumnIndex - 1)}
              disabled={selectedColumnIndex === -1 || selectedColumnIndex === 0}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
            <IconButton
              onClick={() => moveItem(selectedColumnIndex, selectedColumnIndex + 1)}
              disabled={selectedColumnIndex === -1 || selectedColumnIndex === columnOrder.length - 1}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Grid>
          <Grid item xs={7}>
            {editedColumn && (
              <form noValidate autoComplete="off">
                <TextField
                  label="id"
                  fullWidth
                  disabled
                  margin="normal"
                  value={editedColumn.name}
                />
                <TextField
                  label="Nombre"
                  fullWidth
                  margin="normal"
                  value={editedColumn.header}
                  onChange={(e) => handleInputChange('header', e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedColumn.required}
                      onChange={(e) => handleInputChange('required', e.target.checked)}
                    />
                  }
                  label="Requirido"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedColumn.visible}
                      onChange={(e) => handleInputChange('visible', e.target.checked)}
                    />
                  }
                  label="Visible"
                />
                <TextField
                  label="Comentario"
                  fullWidth
                  margin="normal"
                  value={editedColumn.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                />
                <TextField
                  label="Ancho"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editedColumn.size}
                  onChange={(e) => handleInputChange('size', Number(e.target.value))}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel htmlFor="alinear">Alinear</InputLabel>
                  <Select
                    value={editedColumn.align}
                    label="Alinear"
                    inputProps={{
                      name: 'alinear',
                      id: 'alinear',
                    }}
                    onChange={(e) => handleInputChange('align', e.target.value as 'inherit' | 'left' | 'center' | 'right' | 'justify')}
                  >
                    <MenuItem value="inherit">Inherit</MenuItem>
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                    <MenuItem value="justify">Justify</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Orden"
                  fullWidth
                  margin="normal"
                  value={editedColumn.order}
                  disabled
                />
                {/* Agrega más campos según sea necesario */}
              </form>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            setSelectedColumnIndex(-1);
          }} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            handleSave();
            onClose();
            setSelectedColumnIndex(-1);
          }}
          color="primary"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>

  );

}
