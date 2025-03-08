import React, { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { CollapseButton } from './styles';
import { usePagination } from '../hooks/use-pagination';
import { ChatFileThumbnail } from './chat-thumbanail-file';

// ----------------------------------------------------------------------
type Props = {
  attachments: any[];
};

// Componente memoizado para renderizar un archivo adjunto
const AttachmentItem = React.memo(({ attachment }: { attachment: any }) => (
  <Stack spacing={1.5} direction="row" alignItems="center">
    {attachment.url ? (
      <ChatFileThumbnail
        id={attachment.id}
        slotProps={{ icon: { width: 24, height: 24 } }}
        file={attachment.url}
        size={attachment.size}
        fileName={attachment.name || `${attachment.id}.png`}
        showName={false}
      />
    ) : (
      <Iconify icon="line-md:loading-twotone-loop" width={40} sx={{ color: 'text.disabled' }} />
    )}

    <ListItemText
      primary={attachment.name || `${attachment.id}.png`}
      secondary={fDateTime(attachment.createdAt)}
      primaryTypographyProps={{ noWrap: true, typography: 'body2' }}
      secondaryTypographyProps={{
        mt: 0.25,
        noWrap: true,
        component: 'span',
        typography: 'caption',
        color: 'text.disabled',
      }}
    />
  </Stack>
));

AttachmentItem.displayName = 'AttachmentItem';

// Componente principal
export function ChatRoomAttachments({ attachments }: Props) {
  const collapse = useBoolean(true);
  const itemsPerPage = 5;

  const { currentPage, totalPages, currentItems, handleNextPage, handlePrevPage } = usePagination(
    attachments,
    itemsPerPage
  );

  const totalAttachments = attachments.length;

  // Memoizar la lista de archivos adjuntos para evitar rerenderizados innecesarios
  const renderList = useMemo(
    () =>
      currentItems.map((attachment, index) => (
        <AttachmentItem key={`${attachment.id}-${index}`} attachment={attachment} />
      )),
    [currentItems]
  );

  return (
    <>
      <CollapseButton
        selected={collapse.value}
        disabled={!totalAttachments}
        onClick={collapse.onToggle}
      >
        {`Adjuntos (${totalAttachments})`}
      </CollapseButton>

      {!!totalAttachments && (
        <Collapse in={collapse.value}>
          <Stack spacing={2} sx={{ p: 2 }}>
            {renderList}

            {/* Controles de paginación */}
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <IconButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                sx={{ color: 'text.disabled' }}
              >
                <Iconify icon="eva:arrow-ios-back-fill" />
              </IconButton>

              <span>{`Página ${currentPage} de ${totalPages}`}</span>

              <IconButton
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                sx={{ color: 'text.disabled' }}
              >
                <Iconify icon="eva:arrow-ios-forward-fill" />
              </IconButton>
            </Stack>
          </Stack>
        </Collapse>
      )}
    </>
  );
}
