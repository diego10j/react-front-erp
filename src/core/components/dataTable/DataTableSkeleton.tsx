// @mui
import { Box, Stack, Skeleton } from '@mui/material';

import type { DataTableSkeletonProps } from './types';

// ----------------------------------------------------------------------

export default function DataTableSkeleton({
    rows = 10,
    numColumns = 4,
    heightRow = 33,
}: DataTableSkeletonProps) {
    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Stack direction="row" spacing={1}>
                {Array.from({ length: numColumns }).map((_value, i: number) => (
                    <Box key={i} sx={{ flexGrow: 1 }} >
                        <Skeleton variant="text" width="100%" height={39} />
                    </Box>
                ))}
            </Stack>
            {
                Array.from({ length: rows }).map((_value, index: number) => (
                    <Stack key={index} direction="row" spacing={1}>
                        {Array.from({ length: numColumns }).map((_value2, index2: number) => (
                            <Box key={index2} sx={{ flexGrow: 1 }}>
                                <Skeleton variant="text" width="100%"  height={heightRow} />
                            </Box>
                        ))}
                    </Stack>
                ))
            }
        </Box >
    );
}
