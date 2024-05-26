import { useState, useEffect } from 'react';

import {
  Edit,
  Folder,
  Delete,
  ArrowBack,
  UploadFile,
  MoveToInbox,
  InsertDriveFile,
  CreateNewFolder,
} from '@mui/icons-material';
import {
  Box,
  Card,
  List,
  Link,
  Button,
  Dialog,
  ListItem,
  Container,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  DialogTitle,
  Breadcrumbs,
  ListItemText,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { toTitleCase } from "src/utils/string-util";

import { moveItem,  renameItem } from 'src/api/files/files';

import { FileManagerView } from "src/sections/file-manager/view";



// ----------------------------------------------------------------------
type Props = {
  currentProducto: any;
};

export default function ProductoFiles({ currentProducto }: Props) {


  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [itemToRename, setItemToRename] = useState<any>(null);
  const [sourcePath, setSourcePath] = useState('');
  const [destinationPath, setDestinationPath] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolder]);

  const fetchFiles = async () => {
    try {
      setFiles([]);
    } catch (error) {
      console.error('Error fetching files', error);
    }
  };



  const handleDelete = async (name: string, type: string) => {
    try {
      if (type === 'directory') {
        // await deleteFolder(currentFolder, name);
      } else {
       // await deleteFile(currentFolder, name);
      }
      fetchFiles();
    } catch (error) {
      console.error(`Error deleting ${type}`, error);
    }
  };

  const handleFolderClick = (folderName: string) => {
    setCurrentFolder(`${currentFolder}/${folderName}`);
    setSelectedFile(null);
  };

  const handleBack = () => {
    const folders = currentFolder.split('/');
    folders.pop();
    setCurrentFolder(folders.join('/'));
    setSelectedFile(null);
  };

  const handleRename = async () => {
    try {
      await renameItem(`${currentFolder}/${itemToRename}`, `${currentFolder}/${newName}`);
      setItemToRename(null);
      setNewName('');
      fetchFiles();
    } catch (error) {
      console.error('Error renaming item', error);
    }
  };

  const handleMove = async () => {
    try {
      await moveItem(sourcePath, destinationPath);
      setSourcePath('');
      setDestinationPath('');
      fetchFiles();
    } catch (error) {
      console.error('Error moving item', error);
    }
  };

  const handleOpenDialog = (type: string, item?: string) => {
    setDialogType(type);
    if (type === 'rename') {
      setItemToRename(item);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
  };



  return (
    <>
      <Container>
        <Box my={4}>
          <Typography variant="h4" gutterBottom>
            File Manager
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="#" onClick={() => setCurrentFolder('')}>
              Root
            </Link>
            {currentFolder.split('/').map((folder, index, array) => (
              <Link
                key={index}
                color="inherit"
                href="#"
                onClick={() => setCurrentFolder(array.slice(0, index + 1).join('/'))}
              >
                {folder}
              </Link>
            ))}
          </Breadcrumbs>
          <Box mt={2}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={!currentFolder}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<CreateNewFolder />}
              onClick={() => handleOpenDialog('createFolder')}
              sx={{ ml: 2 }}
            >
              Create Folder
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadFile />}
              component="label"
              sx={{ ml: 2 }}
            >
              Upload File
              <input
                type="file"
                hidden
              />
            </Button>
          </Box>
          <Box mt={2}>
            <List>
              {files.map((file) => (
                <ListItem
                  key={file.name}
                  button
                  onClick={() => {
                    if (file.type === 'directory') handleFolderClick(file.name);
                    setSelectedFile(file);
                  }}
                  selected={selectedFile && selectedFile.name === file.name}
                >
                  {file.type === 'directory' ? <Folder /> : <InsertDriveFile />}
                  <ListItemText primary={file.name} secondary={`${file.size} bytes`} />
                  <IconButton edge="end" aria-label="rename" onClick={() => handleOpenDialog('rename', file)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="move" onClick={() => handleOpenDialog('move', file)}>
                    <MoveToInbox />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.name, file.type)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              titulo
            </DialogTitle>
            <DialogContent>
              {dialogType === 'createFolder' && (
                <>
                  <DialogContentText>
                    Enter the name for the new folder.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    fullWidth
                    variant="outlined"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </>
              )}
              {dialogType === 'rename' && (
                <>
                  <DialogContentText>
                    Enter the new name for the item.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="New Name"
                    fullWidth
                    variant="outlined"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </>
              )}
              {dialogType === 'move' && (
                <>
                  <DialogContentText>
                    Enter the destination path for the item.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Source Path"
                    fullWidth
                    variant="outlined"
                    value={sourcePath}
                    onChange={(e) => setSourcePath(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Destination Path"
                    fullWidth
                    variant="outlined"
                    value={destinationPath}
                    onChange={(e) => setDestinationPath(e.target.value)}
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={() => {
                handleCloseDialog();
                if (dialogType === 'rename') handleRename();
                if (dialogType === 'move') handleMove();
              }} color="primary">
                titulo
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>

      <Card>
        <CardHeader title={toTitleCase(currentProducto.nombre_inarti)} sx={{ mb: 2 }}
        />
        <FileManagerView />
      </Card>
    </>
  );

}
// {dialogType === 'createFolder' ? 'Create' : dialogType === 'rename' ? 'Rename' : 'Move'}
