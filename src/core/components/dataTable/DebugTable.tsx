import type {
  Table,
} from '@tanstack/react-table';
import type { Theme, SxProps } from '@mui/material/styles';

import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Portal, Tooltip, Collapse, Typography, IconButton, ButtonBase } from '@mui/material';

import { Scrollbar } from 'src/components/scrollbar'; // Replace with your own Scrollbar component
import { Iconify } from 'src/components/iconify'; // Replace with your icon component
import { bgBlur, varAlpha } from 'src/theme/styles';

import { CloseIcon } from '../icons/CommonIcons'; // Replace with your own styles


const classes = { item: 'item', key: 'item__key', value: 'item__value' };

type Props = {
  table: Table<any>;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
  sx?: SxProps<Theme>;
};

export function DebugTable({ table, setDebug, sx }: Props) {
  const theme = useTheme();

  const tableState = table.getState();

  const { columnFilters, sorting, rowSelection, globalFilter, columnVisibility, pagination } = tableState;





  const renderHead = (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        position: 'sticky',
        top: 0,
        py: 2,
        pr: 1,
        pl: 2.5,
        zIndex: 1,
        backgroundColor: theme.vars.palette.grey[800],
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Debug Table
      </Typography>

      <Tooltip title="Cerrar">
        <IconButton onClick={() => setDebug(false)}>
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
          <Group label="Table State" sx={{ color: 'success.light' }}>
            <div className={classes.item}>
              <span className={classes.key}>Row Count</span>
              <span className={classes.value}>
                {JSON.stringify(table.getRowModel().rows.length, null, 2)}
              </span>
            </div>
            <div className={classes.item}>
              <span className={classes.key}>Sorting</span>
              <span className={classes.value}>
                {JSON.stringify(sorting, null, 2)}
              </span>
            </div>
            <div className={classes.item}>
              <span className={classes.key}>Pagination</span>
              <span className={classes.value}>
                {JSON.stringify(pagination, null, 2)}
              </span>
            </div>
            <div className={classes.item}>
              <span className={classes.key}>Global Filter</span>
              <span className={classes.value}>
                {JSON.stringify(globalFilter, null, 2)}
              </span>
            </div>
            <div className={classes.item}>
              <span className={classes.key}>Column Visibility</span>
              <span className={classes.value}>
                {JSON.stringify(columnVisibility, null, 2)}
              </span>
            </div>
          </Group>

          <Group label={`Selected Rows `} sx={{ color: 'warning.light' }}>
            {JSON.stringify(rowSelection, null, 2)}
          </Group>
          <Group label={`Column Filters(${columnFilters.length})`} sx={{ color: 'info.light' }}>
            {JSON.stringify(columnFilters.map((row: any) => row), null, 2)}
          </Group>
        </Scrollbar>
      </Stack>
    </Portal>
  );
}

// Reusable Group Component
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
