import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import { CardProps } from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';

import { renameFile, favoriteFile } from 'src/api/files/files';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IFolderManager } from 'src/types/file';

import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerFileDetails from './file-manager-file-details';
import FileManagerNewFolderDialog from './file-manager-new-folder-dialog';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  folder: IFolderManager;
  selected?: boolean;
  onSelect?: VoidFunction;
  onDelete: VoidFunction;
  onChangeFolder?: VoidFunction;
  mutate?: VoidFunction;
}

export default function FileManagerFolderItem({
  folder,
  selected,
  onSelect,
  onDelete,
  onChangeFolder,
  sx,
  mutate,
  ...other
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const [folderName, setFolderName] = useState(folder.name);

  const editFolder = useBoolean();

  const checkbox = useBoolean();

  const share = useBoolean();

  const popover = usePopover();

  const confirm = useBoolean();

  const details = useBoolean();

  const favorite = useBoolean(folder.isFavorited);

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeFolderName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  }, []);

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(folder.url);
  }, [copy, enqueueSnackbar, folder.url]);

  const handleFavorite = useCallback(async () => {
    favorite.onToggle();
    try {
      await favoriteFile({ id: folder.id, favorite: !favorite.value })
      if (mutate)
        mutate();
    } catch (error) {
      console.log(error);
    }
  }, [favorite, folder.id, mutate]);


  const renderAction = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        position: 'absolute',
      }}
    >
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );

  const renderIcon =
    (checkbox.value || selected) && onSelect ? (
      <Checkbox
        size="medium"
        checked={selected}
        onClick={onSelect}
        icon={<Iconify icon="eva:radio-button-off-fill" />}
        checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
        sx={{ p: 0.75 }}
      />
    ) : (
      <Box component="img" src="/assets/icons/files/ic_folder.svg" sx={{ width: 36, height: 36 }} />
    );


  const renderText = (
    <ListItemText
      onClick={details.onTrue}
      primary={folder.name}
      secondary={
        <>
          {fData(folder.size)}
          <Box
            component="span"
            sx={{
              mx: 0.75,
              width: 2,
              height: 2,
              borderRadius: '50%',
              bgcolor: 'currentColor',
            }}
          />
          {folder.totalFiles} archivos
        </>
      }
      primaryTypographyProps={{
        noWrap: true,
        typography: 'subtitle1',
      }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        alignItems: 'center',
        typography: 'caption',
        color: 'text.disabled',
        display: 'inline-flex',
      }}
    />
  );

  const renderAvatar = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 24,
          height: 24,
          '&:first-of-type': {
            fontSize: 12,
          },
        },
      }}
    >
      {folder.shared?.map((person) => (
        <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        spacing={1}
        alignItems="flex-start"
        onDoubleClick={onChangeFolder}
        sx={{
          p: 2.5,
          maxWidth: 222,
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          ...((checkbox.value || selected) && {
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          ...sx,
        }}
        {...other}
      >
        <Box onMouseEnter={checkbox.onTrue} onMouseLeave={checkbox.onFalse}>
          {renderIcon}
        </Box>

        {renderAction}

        {renderText}

        {!!folder?.shared?.length && renderAvatar}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copiar Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            details.onTrue();
          }}
        >
          <Iconify icon="solar:info-circle-bold" />
          Información
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            editFolder.onTrue();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Renombrar
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Eliminar
        </MenuItem>
      </CustomPopover>

      <FileManagerFileDetails
        item={folder}
        favorited={favorite.value}
        onFavorite={handleFavorite}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={() => {
          details.onFalse();
          onDelete();
        }}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={folder.shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <FileManagerNewFolderDialog
        open={editFolder.value}
        onClose={editFolder.onFalse}
        title="Renombrar Carpeta"
        onUpdate={async () => {
          try {
            await renameFile({ id: folder.id, fileName: folderName })
            enqueueSnackbar('Actualizado con exito!');
            if (mutate)
              mutate();
            setFolderName(folderName);
          } catch (error) {
            enqueueSnackbar(error.message || 'Error al renombrar Carpeta', { variant: 'error', });
            setFolderName('');
            console.error(error);
          }
          editFolder.onFalse();
        }}
        folderName={folderName}
        onChangeFolderName={handleChangeFolderName}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content="¿Realmemte quieres enviar el archivo a la Papelera?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Eliminar
          </Button>
        }
      />
    </>
  );
}
