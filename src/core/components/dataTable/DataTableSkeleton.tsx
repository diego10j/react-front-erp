// @mui
import { Box, Skeleton, Grid, Stack } from '@mui/material';
import { DataTableSkeletonProps } from './types';

// ----------------------------------------------------------------------

export default function DataTableSkeleton({
    rows = 10,
    numColumns = 4,
}: DataTableSkeletonProps) {
    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Stack direction="row" spacing={1}>
                {Array.from({ length: numColumns }).map((_value, i: number) => (
                    <Box key={i}>
                        <Skeleton variant="text" width={210} height={38.5} />
                    </Box>
                ))}
            </Stack>
            {
                Array.from({ length: rows }).map((value, index: number) => (
                    <Stack key={index} direction="row" spacing={1}>
                        {Array.from({ length: numColumns }).map((_value2, index2: number) => (
                            <Box key={index2}>
                                <Skeleton variant="text" width={210} height={28.5} />
                            </Box>
                        ))}
                    </Stack>
                ))
            }
        </Box >
    );
}
