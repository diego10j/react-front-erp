import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

function FondoLogin({ ...other }: BoxProps) {
  const theme = useTheme();
  const PRIMARY_MAIN = theme.palette.primary.contrastText;
  const PRIMARY_LIGHT = theme.palette.primary.main;
  return (
    <Box {...other}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="1000.000000pt"
        viewBox="0 0 750.000000 1000.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient
            gradientTransform="rotate(-78.82758620689656,0.2421875,0.20000004768371582) translate(0.07516163793103448,0) scale(0.6896551724137931,1)"
            r="1"
            cy="0.2"
            cx="0.24219"
            spreadMethod="pad"
            id="svg_14"
          >
            <stop offset="0" stopColor={PRIMARY_LIGHT} />
            <stop offset="1" stopOpacity="0.99609" stopColor={PRIMARY_MAIN} />
          </radialGradient>
        </defs>
        <g>
          <g
            strokeWidth="0"
            id="svg_1"
            fill="#000000"
            transform="translate(0, 1000) scale(0.1, -0.1)"
          >
            <path
              fill="url(#svg_14)"
              id="svg_2"
              d="m0,5000l0,-5000l2600,0l2600,0l-5,23c-2,12 -23,128 -45,257c-57,326 -125,689 -161,850c-190,858 -527,1646 -982,2295c-286,408 -584,764 -1252,1495c-633,694 -833,922 -1098,1254c-499,627 -823,1212 -1070,1932c-148,430 -230,784 -363,1557l-58,337l-83,0l-83,0l0,-5000z"
            />
          </g>
        </g>
      </svg>
    </Box>
  );
}

export default memo(FondoLogin);
