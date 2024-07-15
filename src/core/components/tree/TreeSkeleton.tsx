import React from 'react';
// @mui
import { Box, Stack, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';
// ----------------------------------------------------------------------
const StyledBox = styled(Box)(({ theme }) => ({
  overflowX: 'hidden',
  backgroundColor: varAlpha(theme.vars.palette.text.disabledChannel, 0.05),
  width: '100%',
}));


export default function TreeSkeleton() {
  return (
    <StyledBox sx={{ width: '100%', overflow: 'hidden' }}>
      <Stack direction="column" spacing={1}>
        {Array.from({ length: 20 }).map((_value, i: number) => (
          <Box key={i}>
            <Skeleton variant="text" height={33} />
          </Box>
        ))}
      </Stack>
    </StyledBox >
  );
}
