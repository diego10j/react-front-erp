import type { BoxProps } from '@mui/material/Box';

import { useId, forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = BoxProps & {
  href?: string;
  isSingle?: boolean;
  disableLink?: boolean;
};

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    { width, href = '/', height, isSingle = true, disableLink = false, className, sx, ...other },
    ref
  ) => {
    const theme = useTheme();

    const gradientId = useId();

    // const TEXT_PRIMARY = theme.vars.palette.text.primary;
    // const PRIMARY_LIGHT = theme.vars.palette.primary.light;
    const PRIMARY_MAIN = theme.vars.palette.primary.main;
    const PRIMARY_DARKER = theme.vars.palette.primary.dark;

    /*
    * OR using local (public folder)
    *
    const singleLogo = (
      <Box
        alt="Single logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/logo-single.svg`}
        width="100%"
        height="100%"
      />
    );

    const fullLogo = (
      <Box
        alt="Full logo"
        component="img"
        src={`${CONFIG.assetsDir}/logo/logo-full.svg`}
        width="100%"
        height="100%"
      />
    );
    *
    */

    const singleLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={`url(#${`${gradientId}-1`})`}
          d="M86.352 246.358C137.511 214.183 161.836 245.017 183.168 285.573C165.515 317.716 153.837 337.331 148.132 344.418C137.373 357.788 125.636 367.911 111.202 373.752C80.856 388.014 43.132 388.681 14 371.048L86.352 246.358Z"
        />
        <g id="layer1">
          <g id="svg_2">
            <path
              id="path19"
              fill={PRIMARY_DARKER}
              d="m18.99996,22.00002l138.1147,103.52594l179.99937,-1.1974c0,0 40.20348,2.80234 40.20348,47.36823c0,44.56595 -34.10259,47.77268 -34.10259,47.77268l-74.3131,1.79771l101.84018,95.9939c0,0 121.21415,-24.79461 121.21415,-145.18828c0,-120.39366 -138.06829,-148.03174 -138.06829,-148.03174l-334.88789,-2.04103z"
            />
            <g transform="matrix(2.38521, 0, 0, 2.22707, 59.6237, 361.77)" id="g1496">
              <g transform="matrix(0.729101, 0, 0, 0.704026, 155.673, -0.424243)" id="Layer_1">
                <title id="title2141">ProduApps</title>
                <path
                  fill={PRIMARY_MAIN}
                  d="m-151.87366,-16.0992l-85,-105l80,0l90,105l-90,100l-80,0l85,-100z"
                  id="svg_1"
                  strokeWidth="0"
                />
              </g>
            </g>
          </g>
        </g>

      </svg>
    );

    const fullLogo = (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill={`url(#${`${gradientId}-1`})`}
          d="M86.352 246.358C137.511 214.183 161.836 245.017 183.168 285.573C165.515 317.716 153.837 337.331 148.132 344.418C137.373 357.788 125.636 367.911 111.202 373.752C80.856 388.014 43.132 388.681 14 371.048L86.352 246.358Z"
        />
        <g id="layer1">
          <g id="svg_2">
            <path
              id="path19"
              fill={PRIMARY_DARKER}
              d="m18.99996,22.00002l138.1147,103.52594l179.99937,-1.1974c0,0 40.20348,2.80234 40.20348,47.36823c0,44.56595 -34.10259,47.77268 -34.10259,47.77268l-74.3131,1.79771l101.84018,95.9939c0,0 121.21415,-24.79461 121.21415,-145.18828c0,-120.39366 -138.06829,-148.03174 -138.06829,-148.03174l-334.88789,-2.04103z"
            />
            <g transform="matrix(2.38521, 0, 0, 2.22707, 59.6237, 361.77)" id="g1496">
              <g transform="matrix(0.729101, 0, 0, 0.704026, 155.673, -0.424243)" id="Layer_1">
                <title id="title2141">ProduApps</title>
                <path
                  fill={PRIMARY_MAIN}
                  d="m-151.87366,-16.0992l-85,-105l80,0l90,105l-90,100l-80,0l85,-100z"
                  id="svg_1"
                  strokeWidth="0"
                />
              </g>
            </g>
          </g>
        </g>

      </svg>
    );

    const baseSize = {
      width: width ?? 40,
      height: height ?? 40,
      ...(!isSingle && {
        width: width ?? 102,
        height: height ?? 36,
      }),
    };

    return (
      <Box
        ref={ref}
        component={RouterLink}
        href={href}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="Logo"
        sx={{
          ...baseSize,
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {isSingle ? singleLogo : fullLogo}
      </Box>
    );
  }
);
