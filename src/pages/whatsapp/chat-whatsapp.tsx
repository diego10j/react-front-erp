
import type { IGetMensajes } from 'src/types/whatsapp';

import { useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { useGetChats, useGetMensajes } from 'src/api/whatsapp';

import { EmptyContent } from 'src/components/empty-content';

import { Layout } from './sections/layout';
import { ChatNav } from './sections/chat-nav';
import { ChatRoom } from './sections/chat-room';
import { useCollapseNav } from './hooks/use-collapse-nav';
import { ChatMessageList } from './sections/chat-message-list';
import { ChatMessageInput } from './sections/chat-message-input';
import { ChatHeaderDetail } from './sections/chat-header-detail';
import { ChatHeaderCompose } from './sections/chat-header-compose';




// ----------------------------------------------------------------------

export default function ChatWhatsAppPage() {



  const { contacts, contactsLoading } = useGetChats();


  const [selectedContact, setSelectedContact] = useState<any>();



  const [recipients, setRecipients] = useState<any[]>([]);

  const [paramGetMensajes, setParamGetMensajes] = useState<IGetMensajes>(
    {
      telefono: "593983113543"
    }
  );

  const { dataResponse: conversation, isLoading: conversationLoading, error: errorConversation } = useGetMensajes(paramGetMensajes);

  // Fetch messages for the selected contact
  useEffect(() => {
    if (selectedContact) {
      if (paramGetMensajes.telefono !== selectedContact.wa_id_whmem) {
        // console.log(selectedContact);
        setParamGetMensajes({
          ...paramGetMensajes,
          telefono: selectedContact.wa_id_whmem

        });
      }
    }
  }, [paramGetMensajes, selectedContact]);


  const roomNav = useCollapseNav();

  const conversationsNav = useCollapseNav();

  const participants: any[] = [];


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
              participants={participants}
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
                  participants={participants}
                  loading={conversationLoading}
                />
              ) : (
                <EmptyContent
                  imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-chat-active.svg`}
                  title="Select a contact to start chatting"
                  description="Write something awesome..."
                />
              )}

              <ChatMessageInput
                recipients={recipients}
                contact={selectedContact}
                onAddRecipients={handleAddRecipients}
                disabled={!recipients.length && !selectedContact}
              />
            </>
          ),
          details: selectedContact && (
            <ChatRoom
              collapseNav={roomNav}
              participants={participants}
              loading={conversationLoading}
              messages={conversation || []}
            />
          ),
        }}
      />
    </DashboardContent>
  );
}
