import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import { uploadFile } from 'src/api/files/files';

import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';

import { IFile } from 'src/types/file';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  title?: string;
  //
  onCreate?: VoidFunction;
  onUpdate?: VoidFunction;
  //
  selectFolder?:IFile;
  folderName?: string;
  onChangeFolderName?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //
  open: boolean;
  onClose: VoidFunction;
  mutate?: VoidFunction;
}

export default function FileManagerNewFolderDialog({
  title = 'Subir Archivo',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  selectFolder,
  folderName,
  onChangeFolderName,
  mutate,
  ...other
}: Props) {
  const [files, setFiles] = useState<(File | string)[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  const handleUpload = () => {
    files.map(async (file) => {
      try {

        await uploadFile(file as File, selectFolder?.ide_arch);
      } catch (error) {
        enqueueSnackbar(error.message || 'Error al subir archivo', { variant: 'error', });
        onClose();
        return;
      }
      if (mutate)
        mutate();
      enqueueSnackbar('Actualizado con exito!');
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
            label="Folder name"
            value={folderName}
            onChange={onChangeFolderName}
            sx={{ mb: 3 }}
          />
        )}
        {title === 'Subir Archivo' && (
          <Upload multiple files={files} onDrop={handleDrop} onRemove={handleRemoveFile} />
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
