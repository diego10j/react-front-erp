import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

type Props = StackProps & {

  publish?: string;
  action?: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function MenuToolbar({
  publish = 'published',
  action,
  sx,
  ...other
}: Props) {

  const popover = usePopover();

  const renderCommunButtons = (
    <Box sx={{ flexGrow: 0 }} >
      <Tooltip title="Edit">
        <IconButton>
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </Tooltip>
    </Box >
  );



  return (



    <Stack
      spacing={1.5}
      direction="row"
      alignItems="center"
      sx={{
        position: 'sticky',
        top: 0,
        mt: -2,
        mr: -3,
        ml: -5,
        px: 4,
        py: 1,
        zIndex: 1100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'background.neutral',
        border: (theme) =>
          `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
        ...sx,
      }}

      {...other}>

      {renderCommunButtons}


      <Box sx={{ flexGrow: 1 }} />


      <Tooltip title="Guardar">
        <IconButton >
          <Iconify icon="eva:external-link-fill" />
        </IconButton>
      </Tooltip>


      <Tooltip title="Cancelar">
        <IconButton>
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </Tooltip>

      <LoadingButton
        color="inherit"
        variant="contained"
        size="small"
        loading={!publish}
        loadingIndicator="Loading…"
        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        onClick={popover.onOpen}
        sx={{ textTransform: 'capitalize' }}
      >
        {publish}
      </LoadingButton>

    </Stack>




  );
}


// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
