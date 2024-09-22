import { styled } from '@mui/material/styles';
import { Box, Stack, IconButton } from '@mui/material';

import { varAlpha } from 'src/theme/styles';

// ----------------------------------------------------------------------

// Floating toolbar container with styling for positioning and floating effect
const _FloatingToolbar_ = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 55, // Adjust top position
  right: '1%', // Adjust for left or right positioning
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  backgroundColor: varAlpha(theme.palette.grey['50Channel'], 0.8),
  boxShadow: theme.shadows[1],

}));

const FloatingToolbar = styled(Stack)(({ theme }) => ({

  position: 'sticky',
  top: 0,
  mt: -2,
  mr: -5,
  ml: -5,
  px: 4,
  py: 1,
  height: 55,
  zIndex: 1100,
  backdropFilter: 'blur(10px)',
  backgroundColor: 'background.neutral',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end', // Alinea horizontalmente a la derecha
}));

// Toolbar button with rounded background and color styling
const FloatingButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  borderRadius: '50%',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
  },
}));



type Props = {
  children?: React.ReactNode;
};

export function MenuToolbar({
  children
}: Props) {



  return (
    <FloatingToolbar
      spacing={1.5}
      direction="row"
      alignItems="center"
    >
      {children}
    </FloatingToolbar>
  );
}

// <FloatingButton sx={{ backgroundColor: '#80CBC4' }}>
// <Iconify icon="eva:arrow-circle-down-fill" width={24} />
// </FloatingButton>
