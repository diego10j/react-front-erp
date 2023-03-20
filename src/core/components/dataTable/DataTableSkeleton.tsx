// @mui
import { Box, Skeleton, Grid } from '@mui/material';
import { DataTableSkeletonProps } from './types';

// ----------------------------------------------------------------------

export default function DataTableSkeleton({
    rows = 10,
    numColumns = 4,
}: DataTableSkeletonProps) {
    return (
        <Box
        >
            <Grid container spacing={1}>
                {Array.from({ length: numColumns }).map((value, i: number) => (
                    <Grid key={i} item xs>
                        <Skeleton variant="text" width="100%" height={38.5} />
                    </Grid>
                ))}
            </Grid>
            {Array.from({ length: rows }).map((value, index: number) => (
                <Grid key={index} container spacing={1}>
                    {Array.from({ length: numColumns }).map((value2, index2: number) => (
                        <Grid
                            key={index2}
                            item
                            xs
                            sx={{
                                pt: 1,
                                mt: 1
                            }}
                        >
                            <Skeleton variant="text" width="100%" height={25.5} />
                        </Grid>
                    ))}
                </Grid>
            ))}
        </Box>
    );
}
