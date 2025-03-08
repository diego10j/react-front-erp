import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Stack, Typography } from '@mui/material';

import { fData } from 'src/utils/format-number';

import { getMediaFile } from 'src/api/whatsapp';

import { fileThumb, fileFormat } from 'src/components/file-thumbnail/utils';
import { fileThumbnailClasses } from 'src/components/file-thumbnail/classes';

import { ChatDownloadButton } from './chat-download-button';

export type ChatFileThumbnailProps = BoxProps & {
  tooltip?: boolean;
  file: File | string;
  fileName?: string;
  size?: string;
  sx?: SxProps<Theme>;
  id: string;
  showName?: boolean;
  slotProps?: {
    img?: SxProps<Theme>;
    icon?: SxProps<Theme>;
    removeBtn?: SxProps<Theme>;
    downloadBtn?: SxProps<Theme>;
  };
};

// ----------------------------------------------------------------------

export function ChatFileThumbnail({
  sx,
  file,
  fileName,
  showName = true,
  tooltip,
  size = "0",
  slotProps,
  className,
  id,
  ...other
}: ChatFileThumbnailProps) {

  const format = fileName ? fileFormat(fileName) : "image";

  const renderImg = (
    <Box
      component="img"
      src={getMediaFile(id)}
      className={fileThumbnailClasses.img}
      sx={{
        width: 1,
        height: 1,
        objectFit: 'cover',
        borderRadius: 'inherit',
        ...slotProps?.img,
      }}
    />
  );

  const renderIcon = (
    <Box
      component="img"
      src={fileThumb(format)}
      className={fileThumbnailClasses.icon}
      sx={{ width: 1, height: 1, ...slotProps?.icon }}
    />
  );

  const renderContent = (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: 'background.neutral', borderRadius: 1.5, }}>
      <Box
        component="span"
        className={fileThumbnailClasses.root.concat(className ? ` ${className}` : '')}
        sx={{
          width: 36,
          height: 36,
          flexShrink: 0,
          borderRadius: 1.25,
          alignItems: 'center',
          position: 'relative',
          display: 'inline-flex',
          justifyContent: 'center',
          ...sx,
        }}
        {...other}
      >
        {format === 'image' ? renderImg : renderIcon}
        <ChatDownloadButton
          id={id}
          className={fileThumbnailClasses.downloadBtn}
          sx={slotProps?.downloadBtn}
        />

      </Box>
      {showName && (
        <Stack direction="column" spacing={0} sx={{ flex: 1, overflow: 'hidden' }}>
          <Typography
            noWrap // Evita que el texto se divida en varias líneas
            component="span"
            variant="caption"
            sx={{
              color: 'text.secondary',
              pr: 1,
              overflow: 'hidden', // Oculta el contenido que excede el ancho
              textOverflow: 'ellipsis', // Muestra "..." cuando el texto es demasiado largo
            }}
          >
            {fileName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {fData(size).toUpperCase()}
          </Typography>
        </Stack>
      )}
    </Stack>
  );

  if (tooltip) {
    return (
      <Tooltip
        arrow
        title={fileName}
        slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -12] } }] } }}
      >
        {renderContent}
      </Tooltip>
    );
  }

  return renderContent;
}
