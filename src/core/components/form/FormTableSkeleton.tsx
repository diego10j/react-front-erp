// @mui
import { Box, Skeleton, Grid, CardContent, Card, Stack, CardHeader, Tooltip, IconButton } from '@mui/material';
import { FormTableSkeletonProps } from './types';
import Iconify from '../../../components/iconify/Iconify';

// ----------------------------------------------------------------------

export default function FormTableSkeleton({
    numColumns = 6,
    showSubmit,
    showToolbar
}: FormTableSkeletonProps) {
    return (
        <Grid container >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Card>
                    {showToolbar && (
                        <CardHeader
                            action={
                                <Tooltip title="Opciones">
                                    <IconButton color='default'>
                                        <Iconify icon="eva:more-vertical-fill" />
                                    </IconButton>
                                </Tooltip>

                            }
                        />
                    )}
                    <CardContent>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            {Array.from({ length: numColumns }).map((value, i: number) => (
                                <Skeleton key={i} variant="rounded" width="100%" height={40} />
                            ))}
                        </Box>
                    </CardContent>
                    {showSubmit && (
                        <Stack alignItems="flex-end" sx={{ px: 3, mb: 3 }}>
                            <Skeleton variant="rounded" width={87} height={36} />
                        </Stack>
                    )}
                </Card>
            </Grid>
        </Grid>
    );
}
