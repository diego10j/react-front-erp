import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { fileThumb, fileFormat } from 'src/components/file-thumbnail/utils';
import { fileThumbnailClasses } from 'src/components/file-thumbnail/classes';
import { RemoveButton, DownloadButton } from 'src/components/file-thumbnail/action-buttons';


export type ChatFileThumbnailProps = BoxProps & {
  tooltip?: boolean;
  file: File | string;
  imageView?: boolean;
  fileName: string;
  sx?: SxProps<Theme>;
  onDownload?: () => void;
  onRemove?: () => void;
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
  tooltip,
  onRemove,
  imageView,
  slotProps,
  onDownload,
  className,
  ...other
}: ChatFileThumbnailProps) {
  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);


  const format = fileName ? fileFormat(fileName) : "image";

  const renderImg = (
    <Box
      component="img"
      src={previewUrl}
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
      {format === 'image' && imageView ? renderImg : renderIcon}

      {onRemove && (
        <RemoveButton
          onClick={onRemove}
          className={fileThumbnailClasses.removeBtn}
          sx={slotProps?.removeBtn}
        />
      )}

      {onDownload && (
        <DownloadButton
          onClick={onDownload}
          className={fileThumbnailClasses.downloadBtn}
          sx={slotProps?.downloadBtn}
        />
      )}
    </Box>
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
