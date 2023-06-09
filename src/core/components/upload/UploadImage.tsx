import React from 'react';
// @mui
import { Typography, Box, LinearProgress } from '@mui/material';
import { UploadAvatar } from '../../../components/upload';
import { fData } from '../../../utils/format-number';
import { UploadImageProps } from './types';




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