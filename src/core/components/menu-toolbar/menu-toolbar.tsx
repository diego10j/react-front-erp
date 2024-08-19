import type { StackProps } from '@mui/material/Stack';
import type { Theme, SxProps } from '@mui/material/styles';
import type { BreadcrumbsLinkProps } from 'src/components/custom-breadcrumbs';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Breadcrumbs from '@mui/material/Breadcrumbs';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { BreadcrumbsLink } from 'src/components/custom-breadcrumbs/breadcrumb-link';


// ----------------------------------------------------------------------

type Props = StackProps & {

  publish?: string;
  heading?: string;
  moreLink?: string[];
  activeLast?: boolean;
  action?: React.ReactNode;
  links: BreadcrumbsLinkProps[];
  sx?: SxProps<Theme>;
  slotProps?: {
    action: SxProps<Theme>;
    heading: SxProps<Theme>;
    moreLink: SxProps<Theme>;
    breadcrumbs: SxProps<Theme>;
  };
};

export function MenuToolbar({
  publish = 'published',
  links,
  action,
  heading,
  moreLink,
  activeLast,
  slotProps,
  sx,
  ...other
}: Props) {
  const lastLink = links[links.length - 1].name;
  const popover = usePopover();

  const renderLinks = (
    <Breadcrumbs separator={<Separator />} sx={slotProps?.breadcrumbs} >
      {links.map((link, index) => (
        <BreadcrumbsLink
          key={link.name ?? index}
          link={link}
          activeLast={activeLast}
          disabled={link.name === lastLink}
        />
      ))}
    </Breadcrumbs>
  );

  const renderHeading = (
    <Typography variant="h6" sx={{ mb: 1, ...slotProps?.heading }}>
      {heading}
    </Typography>
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
        mr: -5,
        ml: -5,
        px: 4,
        py:1,
        zIndex: 1100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'background.paper',
        borderBottom: (theme) =>
          `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
        ...sx,
      }}

      {...other}>

      {!!links.length && renderLinks}


      <Box sx={{ flexGrow: 1 }} />

      {publish === 'published' && (
        <Tooltip title="Go Live">
          <IconButton >
            <Iconify icon="eva:external-link-fill" />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Edit">
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
        sx={{ textTransform: 'capitalize'}}
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
