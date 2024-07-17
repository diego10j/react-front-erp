import type { IFile } from 'src/types/file';
import type { DialogProps } from '@mui/material/Dialog';

import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { uploadFile } from 'src/api/sistema/files';

import { Upload } from 'src/components/upload';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = DialogProps & {
  open: boolean;
  title?: string;
  folderName?: string;
  selectFolder?: IFile;
  currentProducto?: any;
  onClose: () => void;
  onCreate?: () => void;
  onUpdate?: () => void;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mutate?: () => void;
};

export function FileManagerNewFolderDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  folderName,
  onChangeFolderName,
  title = 'Subir Archivo',
  selectFolder,
  currentProducto,
  mutate,
  ...other
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles]);
    },
    [files]
  );

  const handleUpload = () => {
    files.map(async (file) => {
      try {

        await uploadFile(file as File, selectFolder?.ide_arch, currentProducto?.ide_inarti);
      } catch (error) {
        toast.error(error.message || 'Error al subir archivo');
        onClose();
        return;
      }
      if (mutate)
        mutate();
      toast.success('Actualizado con exito!');
      onClose();
    });

    // console.info('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> {title} </DialogTitle>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        {(onCreate || onUpdate) && (
          <TextField
            fullWidth
            label="Nombre de la carpeta"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}
        {title === 'Subir Archivo' && (
          <Upload multiple value={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
        )}
      </DialogContent>

      <DialogActions>
        {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Eliminar todo
          </Button>
        )}

        {title === 'Subir Archivo' && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:cloud-upload-fill" />}
            onClick={handleUpload}
          >
            Subir
          </Button>
        )}
        <Button
          variant="text"
          onClick={onClose}
        >
          Cancelar
        </Button>



        {(onCreate || onUpdate) && (
          <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
            <Button variant="soft" onClick={onCreate || onUpdate}>
              {onUpdate ? 'Guardar' : 'Crear'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
