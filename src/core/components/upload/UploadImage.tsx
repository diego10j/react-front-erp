import React from 'react';

// @mui
import { Box, Typography, LinearProgress } from '@mui/material';

import { UploadImageProps } from './types';
import { fData } from '../../../utils/format-number';
import { UploadAvatar } from '../../../components/upload';




export default function UploadImage({ useUploadImage, maxSize = 3145728 }: UploadImageProps) {

    const { file, onDropImage, loading } = useUploadImage;

    const handleDropAvatar = (acceptedFiles: File[]) => {
        onDropImage(acceptedFiles[0])
    }

    return (
        <>
            <UploadAvatar
                file={file}
                onDrop={handleDropAvatar}
                helperText={
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 2,
                            mx: 'auto',
                            display: 'block',
                            textAlign: 'center',
                            color: 'text.secondary',
                        }}
                    >
                        Permitido *.jpeg, *.jpg, *.png, *.gif
                        <br /> Tamaño máximo {fData(maxSize)}
                    </Typography>
                }

            />
            {loading === true && (
                <Box sx={{ width: '50%', mt: 2, mx: 'auto', display: 'block', textAlign: 'center' }}>
                    <LinearProgress />
                </Box>
            )}
        </>
    );

}
