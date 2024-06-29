import type { Theme} from '@mui/material/styles';

import { alpha } from '@mui/material/styles';
import { tableRowClasses } from '@mui/material/TableRow';

// ----------------------------------------------------------------------

export function tablex(theme: Theme) {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          [`&.${tableRowClasses.selected}`]: {
            backgroundColor: `${alpha(theme.palette.primary.dark, 0.04)} !important`,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.dark, 0.08),
            },
          },
          '&:nth-of-type(odd)': {
            backgroundColor: alpha(theme.palette.action.hover, 0.03),
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomStyle: 'dashed',
        },
        head: {
          fontSize: 14,
          color: theme.palette.text.secondary,
          fontWeight: theme.typography.fontWeightSemiBold,
          backgroundColor: theme.palette.background.neutral,
          borderBottom: `solid 1px ${theme.palette.divider}`,
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
        },
        paddingCheckbox: {
          paddingLeft: theme.spacing(1),
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          width: '100%',
        },
        toolbar: {
          height: 64,
        },
        actions: {
          marginRight: 8,
        },
        select: {
          paddingLeft: 8,
          '&:focus': {
            borderRadius: theme.shape.borderRadius,
          },
        },
        selectIcon: {
          right: 4,
          width: 16,
          height: 16,
          top: 'calc(50% - 8px)',
        },
      },
    },
  };
}
