import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type SearchNotFoundProps = BoxProps & {
    query?: string;
};

export function ChatSearchNotFound({ query, sx, ...other }: SearchNotFoundProps) {
    if (!query) {
        return (
            <Typography variant="body2" sx={sx}>
                Ingrese el nombre o número telefónico
            </Typography>
        );
    }

    return (
        <Box sx={{ textAlign: 'center', borderRadius: 1.5, ...sx }} {...other}>
            <Box sx={{ mb: 1, typography: 'h6' }}>No encontrado</Box>

            <Typography variant="body2">
                No se encontraron contactos para &nbsp;
                <strong>{`"${query}"`}</strong>
                .
                <br /> Intente comprobar si hay errores tipográficos..
            </Typography>
        </Box>
    );
}
