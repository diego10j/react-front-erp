import { styled } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';

// ----------------------------------------------------------------------

// Optimized toolbar component with conditional styles based on 'sticky' prop
const Toolbar = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky: boolean }>(({ theme, sticky }) => ({
  top: 0,
  mt: -2,
  mr: -5,
  ml: -5,
  px: 4,
  py: 2,
  height: 58,
  zIndex: 1100,
  display: 'flex',
  alignItems: 'center',
  backdropFilter: sticky ? 'blur(6px)' : 'none', // Blur only for sticky
  backgroundColor: 'background.neutral',
  position: sticky ? 'sticky' : 'static',
}));

type Props = {
  sticky?: boolean;
  childrenLeft?: React.ReactNode;
  children?: React.ReactNode;
};

export function MenuToolbar({
  sticky = false,
  childrenLeft,
  children
}: Props) {
  return (
    <Toolbar sticky={sticky} spacing={1.5} direction="row" alignItems="center">
      <Box>
        {childrenLeft}
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      {children}
    </Toolbar>
  );
}
