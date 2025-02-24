import type { UploadProps } from 'src/components/upload';

import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from 'src/components/iconify';
import { uploadClasses } from 'src/components/upload/classes';





// ----------------------------------------------------------------------

export function ChatUpload({ placeholder, error, disabled, className, sx, ...other }: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <Box
      {...getRootProps()}
      className={uploadClasses.uploadBox.concat(className ? ` ${className}` : '')}
      sx={{
        width: 48,
        height: 48,
        flexShrink: 0,
        display: 'flex',
        borderRadius: 1,
        cursor: 'pointer',
        alignItems: 'center',
        color: 'text.disabled',
        justifyContent: 'center',
        ...(isDragActive && { opacity: 0.72 }),
        ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        }),
        '&:hover': { opacity: 0.72 },
        ...sx,
      }}
    >
      <input {...getInputProps()} />

      {placeholder || <Iconify icon="eva:attach-2-fill" width={24} />}
    </Box>
  );
}
