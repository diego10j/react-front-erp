import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Button, Chip, MenuItem, MenuList, Skeleton, Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useResponsive } from 'src/hooks/use-responsive';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { ToggleButton } from './styles';
import { ChatNavItem } from './chat-nav-item';
import { ChatNavAccount } from './chat-nav-account';
import { ChatNavItemSkeleton } from './chat-skeleton';
import { ChatNavSearchResults } from './chat-nav-search-results';

import type { UseNavCollapseReturn } from '../hooks/use-collapse-nav';
import { useGetListas } from 'src/api/whatsapp';
import { CustomPopover, usePopover } from 'src/components/custom-popover';


// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

type Props = {
  loading: boolean;
  selectedConversationId: string;
  contacts: any[]; // IChatParticipant
  collapseNav: UseNavCollapseReturn;
  // conversations: IChatConversations;
  hasSocketConnection: boolean;
  onSelectContact: (contact: any) => void;
  onChangeEstadoChat: (id: string, estado: boolean) => void;
};

export function ChatNav({
  loading,
  contacts,
  collapseNav,
  hasSocketConnection,
  // conversations,
  selectedConversationId,
  onSelectContact,
  onChangeEstadoChat
}: Props) {


  const mdUp = useResponsive('up', 'md');

  const { dataResponse: lists, isLoading: loadingLists } = useGetListas();

  const [selectList, setSelectList] = useState({ "ide_whlis": -1, "nombre_whlis": "Todos", total_chats: null });

  const popover = usePopover();

  const handleChangeSelectList = useCallback((newValue: any) => {
    setSelectList(newValue);
  }, []);

  const {
    openMobile,
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    collapseDesktop,
    onCollapseDesktop,
  } = collapseNav;

  const [searchContacts, setSearchContacts] = useState<{
    query: string;
    results: any[];
  }>({
    query: '',
    results: [],
  });


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

  const handleSearchContacts = useCallback(
    (inputValue: string) => {
      setSearchContacts((prevState) => ({ ...prevState, query: inputValue }));

      if (inputValue) {
        const results = contacts.filter((contact) =>
          contact.nombre_whcha.toLowerCase().includes(inputValue)
        );

        setSearchContacts((prevState) => ({ ...prevState, results }));
      }
    },
    [contacts]
  );

  const handleClickAwaySearch = useCallback(() => {
    setSearchContacts({ query: '', results: [] });
  }, []);

  const handleClickResult = useCallback(
    async (result: any) => {
      handleClickAwaySearch();

      try {

        onSelectContact(result);

        // Find the recipient in contacts
        const recipient = contacts.find((contact) => contact.ide_whcha === result.ide_whcha);
        if (!recipient) {
          console.error('Recipient not found');
        }

      } catch (error) {
        console.error('Error handling click result:', error);
      }
    },
    [contacts, handleClickAwaySearch, onSelectContact]
  );

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

  const renderListResults = (
    <ChatNavSearchResults
      query={searchContacts.query}
      results={searchContacts.results}
      onClickResult={handleClickResult}
    />
  );

  const renderSearchInput = (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', mt: 2.5 }}>
      {/* Campo de búsqueda con icono */}
      <ClickAwayListener onClickAway={handleClickAwaySearch}>
        <TextField
          fullWidth
          size="small"
          value={searchContacts.query}
          onChange={(event) => handleSearchContacts(event.target.value)}
          placeholder={selectList.ide_whlis === -1 ? 'Buscar chats' : `Buscar chats ${selectList?.nombre_whlis.toLowerCase()}`}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </ClickAwayListener>

      {/* Botón para agregar contacto */}
      <Tooltip title="Enviar mensaje" placement="top-start">
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

      {loadingLists === false && (
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
                displayText = `${option.nombre_whlis} (x)`; 
              } 
              else{
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
                  {displayText}
                </MenuItem>
              );
            })}
          </MenuList>
        </CustomPopover>
      )}

      <Box sx={{ p: 2.5, pt: 0 }}>{!collapseDesktop && renderSearchInput}</Box>

      {loading ? (
        renderLoading
      ) : (
        <Scrollbar sx={{ pb: 1 }}>
          {searchContacts.query && !!contacts.length ? renderListResults : renderList}
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
