import type { Breakpoint } from '@mui/material/styles';

import { useMemo, useState, useEffect, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

type UseResponsiveReturn = boolean;

export type Query = 'up' | 'down' | 'between' | 'only';

export type Value = Breakpoint | number;

export function useResponsive(query: Query, start?: Value, end?: Value): UseResponsiveReturn {
  const theme = useTheme();

  const getQuery = useMemo(() => {
    switch (query) {
      case 'up':
        return theme.breakpoints.up(start as Value);
      case 'down':
        return theme.breakpoints.down(start as Value);
      case 'between':
        return theme.breakpoints.between(start as Value, end as Value);
      case 'only':
        return theme.breakpoints.only(start as Breakpoint);
      default:
        return theme.breakpoints.up('xs');
    }
  }, [theme, query, start, end]);

  const mediaQueryResult = useMediaQuery(getQuery);

  return mediaQueryResult;
}

// ----------------------------------------------------------------------

type UseWidthReturn = Breakpoint;

export function useWidth(): UseWidthReturn {
  const theme = useTheme();

  const keys = useMemo(() => [...theme.breakpoints.keys].reverse(), [theme]);

  const width = keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = useMediaQuery(theme.breakpoints.up(key));

    return !output && matches ? key : output;
  }, null);

  return width || 'xs';
}


export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Solo actualiza si el tamaño cambió
    setScreenSize(prevSize => {
      if (prevSize.width !== newWidth || prevSize.height !== newHeight) {
        return { width: newWidth, height: newHeight };
      }
      return prevSize;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return screenSize;
}

// ----------------------------------------------------------------------
