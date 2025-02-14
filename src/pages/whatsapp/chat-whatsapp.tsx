import { useState, useCallback } from 'react';

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
import { ChatHeaderCompose } from './sections/chat-header-compose';
import { useWebSocketChats } from './hooks/use-web-socket-chats';


// ----------------------------------------------------------------------

export default function ChatWhatsAppPage() {

  const { contacts, contactsLoading, conversation, conversationLoading, selectedContact, setSelectedContact } = useWebSocketChats();
  const [recipients, setRecipients] = useState<any[]>([]);

  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();


  const handleAddRecipients = useCallback((selected: any[]) => {
    setRecipients(selected);
  }, []);

  return (
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
          header: selectedContact ? (
            <ChatHeaderDetail
              contact={selectedContact}
              collapseNav={roomNav}
              participants={[]}
              loading={conversationLoading}

            />
          ) : (
            <ChatHeaderCompose contacts={contacts} onAddRecipients={handleAddRecipients} />
          ),
          nav: (
            <ChatNav
              contacts={contacts}
              loading={contactsLoading}
              selectedConversationId={selectedContact}
              collapseNav={conversationsNav}
              onSelectContact={setSelectedContact}
            />
          ),
          main: (
            <>
              {selectedContact ? (
                <ChatMessageList
                  contact={selectedContact}
                  messages={conversation || []}
                  loading={conversationLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                  title="Selecciona un contacto para empezar a chatear"
                  description="Write something awesome..."
                />
              )}

              <ChatMessageInput
                contact={selectedContact}
                disabled={!recipients.length && !selectedContact}
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
  );
}
