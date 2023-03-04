import { forwardRef } from 'react';
import { m, useScroll, useSpring } from 'framer-motion';
// @mui
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface ScrollProgressProps extends BoxProps {
  color?: 'inherit' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: number;
}

const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  ({ color = 'primary', size = 3, sx, ...other }, ref) => {
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
      stiffness: 100,
      damping: 30,
      restDelta: 0.001,
    });

    return (
      <Box
        ref={ref}
        component={m.div}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          height: size,
          zIndex: 1999,
          position: 'fixed',
          transformOrigin: '0%',
          bgcolor: `${color}.main`,
          ...(color === 'inherit' && {
            bgcolor: 'text.primary',
          }),
          ...sx,
        }}
        style={{ scaleX }}
        {...other}
      />
    );
  }
);

export default ScrollProgress;
