import type { FieldValues } from 'react-hook-form';
import type { Theme, SxProps } from '@mui/material/styles';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ButtonBase from '@mui/material/ButtonBase';
import { Box, Tooltip, Typography } from '@mui/material';

import { bgBlur, varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { fileData } from 'src/components/file-thumbnail';

import { CloseIcon } from '../icons/CommonIcons';

// ----------------------------------------------------------------------

const classes = { item: 'item', key: 'item__key', value: 'item__value' };

type Props = {
  setDebug: React.Dispatch<React.SetStateAction<boolean>>,
  columnChange: string[],
  isChangeDetected: boolean,
  isUpdate: boolean,
  sx?: SxProps<Theme>
};

export function DebugForm({ columnChange, isChangeDetected, isUpdate, setDebug, sx }: Props) {
  const theme = useTheme();

  const { watch, formState } = useFormContext();

  const values = watch();

  const totalValues = Object.keys(values).length;

  const totalErrors = Object.keys(formState.errors).length;


  const renderHead = (
    <Box display="flex" alignItems="center" sx={{
      position: 'sticky',
      top: 0,
      py: 2,
      pr: 1,
      pl: 2.5,
      zIndex: 1, // Asegura que esté sobre otros elementos
      backgroundColor: theme.vars.palette.grey[800], // Agregar fondo para evitar superposición visual
    }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Debug
      </Typography>



      <Tooltip title="Cerrar">
        <IconButton onClick={() => {
          setDebug(false);
        }}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );


  return (
    <Portal>
      <Stack
        sx={{
          ...bgBlur({ color: varAlpha(theme.vars.palette.grey['900Channel'], 0.9) }),
          top: 0,
          right: 0,
          height: 1,
          width: 320,
          position: 'fixed',
          overflowY: 'auto',
          color: 'common.white',
          zIndex: theme.zIndex.drawer,
          ...sx,
        }}
      >
        {renderHead}
        <Scrollbar>
          <Group label="State" sx={{ color: 'success.light' }}>
            {[
              'submitCount',
              'isDirty',
              'isValid',
              'disabled',
              'isLoading',
              'isSubmitted',
              'isSubmitting',
              'isValidating',
              'isSubmitSuccessful',
            ].map((item) => (
              <div key={item} className={classes.item}>
                <span className={classes.key}>{item}</span>
                <span className={classes.value}>
                  {JSON.stringify((formState as Record<string, any>)[item], null, 2)}
                </span>
              </div>
            ))}
            <div className={classes.item}>
              <span className={classes.key}>isChangeDetected</span>
              <span className={classes.value}>
                {JSON.stringify(isChangeDetected, null, 2)}
              </span>
            </div>
            <div className={classes.item}>
              <span className={classes.key}>isUpdate</span>
              <span className={classes.value}>
                {JSON.stringify(isUpdate, null, 2)}
              </span>
            </div>

          </Group>

          <Group label={`Values (${totalValues})`} sx={{ color: 'warning.light' }}>
            {Object.keys(values).map((value) => (
              <div key={value} className={classes.item}>
                <span className={classes.key}>{value}</span>
                <span className={classes.value}>{parseValue(values, value)}</span>
              </div>
            ))}
          </Group>

          <Group label={`Changes (${columnChange.length})`} sx={{ color: 'warning.light' }}>
            {JSON.stringify(columnChange, null, 2)}
          </Group>


          <Group label={`Errors (${totalErrors})`} sx={{ color: 'error.light' }}>
            {JSON.stringify(Object.keys(formState.errors), null, 2)}
          </Group>


          <Group label="Dirty fields" sx={{ color: 'info.light' }}>
            {JSON.stringify(Object.keys(formState.dirtyFields), null, 2)}
          </Group>

          <Group label="Touched fields" sx={{ color: 'info.light' }}>
            {JSON.stringify(Object.keys(formState.touchedFields), null, 2)}
          </Group>
        </Scrollbar>
      </Stack>

    </Portal>
  );
}

// ----------------------------------------------------------------------

type GroupProps = {
  label: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

function Group({ label, children, sx }: GroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <Stack sx={{ borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}`, ...sx }}>
      <ButtonBase
        onClick={() => setOpen(!open)}
        sx={{
          p: 1.5,
          typography: 'overline',
          justifyContent: 'space-between',
          ...(open && { bgcolor: 'action.hover' }),
        }}
      >
        {label}
        <Iconify width={16} icon="eva:arrow-ios-downward-fill" />
      </ButtonBase>

      <Collapse in={open}>
        <Stack
          spacing={0.25}
          sx={{
            p: 1,
            typography: 'caption',
            [`& .${classes.item}`]: { display: 'inline-flex', alignItems: 'flex-start' },
            [`& .${classes.key}`]: {
              px: 0.5,
              color: 'common.white',
              bgcolor: (theme) => varAlpha(theme.vars.palette.common.blackChannel, 0.4),
            },
            [`& .${classes.value}`]: {
              flex: '1 1 auto',
              textAlign: 'right',
              bgcolor: (theme) => varAlpha(theme.vars.palette.common.blackChannel, 0.2),
            },
          }}
        >
          {children}
        </Stack>
      </Collapse>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function parseValue(values: FieldValues, value: string) {
  if (value === 'singleUpload') {
    return JSON.stringify(values.singleUpload && fileData(values.singleUpload), null, 2);
  }
  if (value === 'multiUpload') {
    return JSON.stringify(
      values.multiUpload.map((file: File) => fileData(file)),
      null,
      2
    );
  }
  return JSON.stringify(values[value], null, 2) || '---';
}
