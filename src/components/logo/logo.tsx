import { forwardRef } from 'react';

import Link from '@mui/material/Link';
// @mui
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();


    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
        >
          <g id="layer1">
            <g id="svg_2">
              <path
                id="path19"
                fill={PRIMARY_DARK}
                d="m18.99996,22.00002l138.1147,103.52594l179.99937,-1.1974c0,0 40.20348,2.80234 40.20348,47.36823c0,44.56595 -34.10259,47.77268 -34.10259,47.77268l-74.3131,1.79771l101.84018,95.9939c0,0 121.21415,-24.79461 121.21415,-145.18828c0,-120.39366 -138.06829,-148.03174 -138.06829,-148.03174l-334.88789,-2.04103z"
              />
              <g transform="matrix(2.38521, 0, 0, 2.22707, 59.6237, 361.77)" id="g1496">
                <g transform="matrix(0.729101, 0, 0, 0.704026, 155.673, -0.424243)" id="Layer_1">
                  <title id="title2141">ProduApps</title>
                  <path
                    fill={PRIMARY_MAIN}
                    stroke="#000000"
                    d="m-151.87366,-16.0992l-85,-105l80,0l90,105l-90,100l-80,0l85,-100z"
                    id="svg_1"
                    strokeWidth="0"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>

      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
