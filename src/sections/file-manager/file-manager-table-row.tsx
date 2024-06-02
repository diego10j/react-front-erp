import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IFileManager } from 'src/types/file';

import { favoriteFile } from '../../api/files/files';
import { toTitleCase } from '../../utils/string-util';
import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerFileDetails from './file-manager-file-details';

// ----------------------------------------------------------------------

type Props = {
  row: IFileManager;
  selected: boolean;
  mode: string;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onChangeFolder: VoidFunction;
  mutate?: VoidFunction;
};

export default function FileManagerTableRow({ row, selected, mode, onSelectRow, onDeleteRow, onChangeFolder, mutate }: Props) {
  const theme = useTheme();

  const { name, size, type, modifiedAt, usuario_ingre, isFavorited, shared } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => onChangeFolder(),
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copiado!', { variant: 'info', });
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  const handleFavorite = useCallback(async () => {
    favorite.onToggle();
    try {
      await favoriteFile({ id: row.id, favorite: !favorite.value })
      if (mutate)
        mutate();
    } catch (error) {
      console.log(error);
    }
  }, [favorite, mutate, row.id]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        selected={selected}
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
          />
        </TableCell>

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={type} sx={{ width: 36, height: 36 }} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(size)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {type}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={fDate(modifiedAt)}
            secondary={fTime(modifiedAt)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="right" onClick={handleClick}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >

            <Avatar alt={toTitleCase(usuario_ingre)} src={usuario_ingre} />

          </AvatarGroup>
        </TableCell>



        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {type !== 'folder' && (
            <Checkbox
              color="warning"
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
              checked={favorite.value}
              onChange={handleFavorite}
              sx={{ p: 0.75 }}
            />
          )}
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>



      </TableRow>

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
          Copiar link
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            share.onTrue();
          }}
        >
          <Iconify icon="solar:share-bold" />
          Compartir
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
        item={row}
        favorited={favorite.value}
        onFavorite={handleFavorite}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Eliminar"
        content={mode !== 'trash' ? '¿Realmemte quieres enviar el archivo a la Papelera?' : '¿Realmemte quieres eliminar el archivo de forma permante?'}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Eliminar
          </Button>
        }
      />
    </>
  );
}
