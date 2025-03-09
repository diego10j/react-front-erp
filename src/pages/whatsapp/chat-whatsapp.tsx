
import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';

import { Layout } from './sections/layout';
import { ChatNav } from './sections/chat-nav';
import { ChatRoom } from './sections/chat-room';
import { useCollapseNav } from './hooks/use-collapse-nav';
import { ChatMessageList } from './sections/chat-message-list';
import { ChatMessageInput } from './sections/chat-message-input';
import { ChatHeaderDetail } from './sections/chat-header-detail';
import { useWebSocketChats } from './hooks/use-web-socket-chats';


// ----------------------------------------------------------------------

export default function ChatWhatsAppPage() {

  const {
    contactsLoading,
    conversation,
    conversationLoading,
    selectedContact,
    filteredContacts,
    totalFavoriteChats,
    totalUnReadChats,
    lists,
    listsLoading,
    selectList,
    setSelectList,
    setSelectedContact,
    changeEstadoChat,
    changeUrlMediaFile,
    changeUnReadChat,
    changeFavoriteChat } = useWebSocketChats();

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();


  return (
    <>
      <Helmet>
        <title>{totalUnReadChats === 0 ? 'WhatsApp Pro-ERP' : `WhatsApp (${totalUnReadChats})`}</title>
      </Helmet>
      <DashboardContent
        maxWidth={false}
        sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      >
        <Layout
          sx={{
            minHeight: 0,
            flex: '1 1 0',
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.card,
          }}
          slots={{
            header: selectedContact && (
              <ChatHeaderDetail
                contact={selectedContact}
                collapseNav={roomNav}
                participants={[]}
                loading={conversationLoading}
                lists={lists}
                onChangeUnReadChat={changeUnReadChat}
                onChangeFavoriteChat={changeFavoriteChat}
              />
            ),
            nav: (
              <ChatNav
                contacts={filteredContacts}
                loading={contactsLoading}
                selectedConversationId={selectedContact?.ide_whcha || ''}
                collapseNav={conversationsNav}
                onSelectContact={setSelectedContact}
                onChangeEstadoChat={changeEstadoChat}
                totalFavoriteChats={totalFavoriteChats}
                totalUnReadChats={totalUnReadChats}
                lists={lists}
                listsLoading={listsLoading}
                selectList={selectList}
                setSelectList={setSelectList}
                hasSocketConnection
              />
            ),
            main: (
              <>
                {selectedContact ? (
                  <ChatMessageList
                    contact={selectedContact}
                    messages={conversation || []}
                    loading={conversationLoading}
                    onChangeUrlMediaFile={changeUrlMediaFile}
                  />
                ) : (
                  <EmptyContent
                    imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                    title="Selecciona un contacto para empezar a chatear"
                    description="Optimiza la gestión de tus chats y mantén todo bajo control..."
                  />
                )}

                <ChatMessageInput
                  contact={selectedContact}
                  disabled={!selectedContact}
                />
              </>
            ),
            details: selectedContact && (
              <ChatRoom
                collapseNav={roomNav}
                participants={[selectedContact]}
                loading={conversationLoading}
                messages={conversation || []}
              />
            ),
          }}
        />
      </DashboardContent>
    </>
  );
}
