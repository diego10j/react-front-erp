import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Button, Tooltip, MenuItem, MenuList } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';


import type { UseNavCollapseReturn } from '../hooks/use-collapse-nav';
import { useDebounce } from 'src/hooks/use-debounce';
import { useSearchContacto } from 'src/api/whatsapp';
import { ChatSearch } from './chat-search';

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  selectedConversationId: string;
  contacts: any[];
  collapseNav: UseNavCollapseReturn;
  totalFavoriteChats?: number,
  totalUnReadChats?: number,
  lists: any[],
  listsLoading: boolean,
  selectList: any,
  hasSocketConnection: boolean;
  setSelectList: React.Dispatch<React.SetStateAction<any>>;
  onSelectContact: (contact: any) => void;
  onChangeEstadoChat: (id: string, estado: boolean) => void;
};

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  hasSocketConnection,
  totalFavoriteChats = 0,
  totalUnReadChats = 0,
  selectedConversationId,
  lists,
  listsLoading,
  selectList,
  setSelectList,
  onSelectContact,
  onChangeEstadoChat
}: Props) {


  const mdUp = useResponsive('up', 'md');

  const popover = usePopover();


  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);

  const { dataResponse: searchResults, isLoading: searchLoading } = useSearchContacto({ texto: debouncedQuery, lista: selectList.ide_whlis });

  const handleChangeSelectList = useCallback((newValue: any) => {
    setSelectList(newValue);
  }, [setSelectList]);

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  useEffect(() => {
    if (!mdUp) {
      onCloseDesktop();
    }
  }, [onCloseDesktop, mdUp]);

  const handleToggleNav = useCallback(() => {
    if (mdUp) {
      onCollapseDesktop();
    } else {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile, onCollapseDesktop]);

  const handleClickCompose = useCallback(() => {
    if (!mdUp) {
      onCloseMobile();
    }
  }, [mdUp, onCloseMobile]);


  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);


  const renderLoading = <ChatNavItemSkeleton />;

  const renderList = (
    <nav>
      <Box component="ul">
        {contacts.map((conversationId) => (

          <ChatNavItem
            key={conversationId.ide_whcha}
            collapse={collapseDesktop}
            conversation={conversationId}
            selected={conversationId.ide_whcha === selectedConversationId}
            onCloseMobile={onCloseMobile}
            onSelectContact={onSelectContact}
            onChangeEstadoChat={onChangeEstadoChat}
          />


        ))}
      </Box>
    </nav>
  );



  const renderSearchInput = (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', mt: 2.5 }}>
      {/* Campo de búsqueda con icono */}
      <ChatSearch
        query={debouncedQuery}
        results={searchResults}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        loading={searchLoading}
        onSelectContact={onSelectContact}
        title={selectList.ide_whlis === -1 ? 'Buscar contacto' : `Buscar contacto ${selectList?.nombre_whlis.toLowerCase()}`}
      />

      {/* Botón para agregar contacto */}
      <Tooltip title="Nuevo contacto" placement="top-start">
        <IconButton
          onClick={handleClickCompose}
        >
          <Iconify icon="solar:user-plus-bold" sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const renderContent = (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ p: 2.5, pb: 0 }}>
        {!collapseDesktop && (
          <>
            <ChatNavAccount hasSocketConnection={hasSocketConnection} />
            <Box sx={{ flexGrow: 1 }} />
          </>
        )}


        {!collapseDesktop && (
          <Stack direction="row" spacing={2}>
            <Button
              color="inherit"
              variant="outlined"
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              onClick={popover.onOpen}
              sx={{ textTransform: 'capitalize' }}
            >
              {selectList.icono_whlis && (
                <Iconify icon={selectList.icono_whlis} sx={{ ml: 1, width: 16, height: 16, mr: 1 }} />
              )}
              {selectList.nombre_whlis}
            </Button>

          </Stack>
        )}

        <IconButton onClick={handleToggleNav}>
          <Iconify
            icon={collapseDesktop ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          />
        </IconButton>
      </Stack>

      {listsLoading === false && (
        <CustomPopover
          open={popover.open}
          anchorEl={popover.anchorEl}
          onClose={popover.onClose}
          slotProps={{ arrow: { placement: 'top-right' } }}
        >
          <MenuList>
            {lists.map((option: any) => {
              let displayText = option.nombre_whlis;

              if (option.ide_whlis === -1) {
                displayText = option.nombre_whlis; // Solo el nombre
              } else if (option.ide_whlis === -2) {
                displayText = `${option.nombre_whlis} (${totalUnReadChats})`;
              }
              else if (option.ide_whlis === -3) {
                displayText = `${option.nombre_whlis} (${totalFavoriteChats})`;
              }
              else {
                displayText = `${option.nombre_whlis} (${option?.total_chats})`;
              }

              return (
                <MenuItem
                  key={option.ide_whlis}
                  selected={option.ide_whlis === selectList.ide_whlis}
                  onClick={() => {
                    popover.onClose();
                    handleChangeSelectList(option);
                  }}
                >
                  {option.icono_whlis && (
                    <Iconify icon={option.icono_whlis} sx={{ ml: 1, width: 16, height: 16 }} />
                  )}
                  {displayText}
                </MenuItem>
              );
            })}
          </MenuList>
        </CustomPopover>
      )}

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}     </Box>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {renderList}
        </Scrollbar>
      )}
    </>
  );

  return (
    <>
      <ToggleButton onClick={onOpenMobile} sx={{ display: { md: 'none' } }}>
        <Iconify width={16} icon="solar:users-group-rounded-bold" />
      </ToggleButton>


      <Stack
        sx={{
          minHeight: 0,
          flex: '1 1 auto',
          width: NAV_WIDTH,
          display: { xs: 'none', md: 'flex' },
          borderRight: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          transition: (theme) =>
            theme.transitions.create(['width'], {
              duration: theme.transitions.duration.shorter,
            }),
          ...(collapseDesktop && { width: NAV_COLLAPSE_WIDTH }),
        }}
      >
        {renderContent}
      </Stack>

      <Drawer
        open={openMobile}
        onClose={onCloseMobile}
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: NAV_WIDTH } }}
      >
        {renderContent}
      </Drawer>
    </>
  );
}
