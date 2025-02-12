import { Box, Typography, LinearProgress } from '@mui/material';

import { fData } from '../../../utils/format-number';
import { Upload, UploadAvatar } from '../../../components/upload';

import type { UploadImageProps } from './types';



export default function UploadImage({ useUploadImage, maxSize = 3145728, type = 'avatar' }: UploadImageProps) {

  const { url, onDropImage, loading } = useUploadImage;

  const handleDropAvatar = (acceptedFiles: File[]) => {
    onDropImage(acceptedFiles[0])
  }


  return (
    <>
      {type === 'avatar' ? (
        <UploadAvatar
          value={url}
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
      ) : (
        <Upload
          multiple={false}
          value={url}
          onDrop={handleDropAvatar}
        />
      )}
      {loading === true && (
        <Box sx={{ width: '50%', mt: 2, mx: 'auto', display: 'block', textAlign: 'center' }}>
          <LinearProgress />
        </Box>
      )}
    </>
  );

}
