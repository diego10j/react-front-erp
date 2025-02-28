import type { IGetMensajes } from 'src/types/whatsapp';
import io, { Socket } from 'socket.io-client';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { CONFIG } from 'src/config-global';
import { useGetChats, useGetMensajes } from 'src/api/whatsapp';

// Función para inicializar el socket (reutilizable)
const initializeSocket = () => {
  return io(CONFIG.webSocketUrl, {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });
};

export function useWebSocketChats() {
  const [paramGetMensajes, setParamGetMensajes] = useState<IGetMensajes>({ telefono: "000000000000" });
  const [hasSocketConnection, setHasSocketConnection] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const { contacts, contactsLoading, mutate: mutateContacts } = useGetChats();
  const {
    dataResponse: conversation,
    isLoading: conversationLoading,
    error: errorConversation,
    mutate: mutateConversation,
  } = useGetMensajes(paramGetMensajes);

  const telefonoRef = useRef(paramGetMensajes.telefono);
  const socketRef = useRef<Socket | null>(null);

  // Efecto para inicializar el socket y manejar la conexión
  useEffect(() => {
    const socket = initializeSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setHasSocketConnection(true);
    };

    const handleDisconnect = () => {
      setHasSocketConnection(false);
    };

    const handleConnectError = () => {
      setHasSocketConnection(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Efecto para actualizar paramGetMensajes cuando se selecciona un contacto
  useEffect(() => {
    if (selectedContact && selectedContact.wa_id_whmem) {
      if (paramGetMensajes.telefono !== selectedContact.wa_id_whmem) {
        setParamGetMensajes({ telefono: selectedContact.wa_id_whmem });
      }
    }
  }, [selectedContact, paramGetMensajes]);

  // Actualizar el teléfono de la ref cuando cambie paramGetMensajes
  useEffect(() => {
    telefonoRef.current = paramGetMensajes.telefono;
  }, [paramGetMensajes]);

  // Función para manejar la lectura de mensajes
  const handleReadMessage = useCallback(async (id: string) => {
    const currentTelefono = selectedContact?.wa_id_whmem;

    await mutateContacts((currentData: any) => {
      return currentData.map((msg: any) =>
        msg.id_whmem === id ? { ...msg, status_whmem: 'read' } : msg
      );
    }, false);

    if (currentTelefono === telefonoRef.current) {
      await mutateConversation((currentData: any) => {
        return currentData.map((msg: any) =>
          msg.id_whmem === id ? { ...msg, status_whmem: 'read' } : msg
        );
      }, false);
    }
  }, [selectedContact, mutateContacts, mutateConversation]);

  // Efecto para escuchar eventos del socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleNewMessage = (telefono: string) => {
      mutateContacts();
      if (telefono === telefonoRef.current) {
        mutateConversation();
      }
    };

    const handleOnReadMessage = (id: string) => {
      handleReadMessage(id);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('onReadMessage', handleOnReadMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('onReadMessage', handleOnReadMessage);
    };
  }, [mutateContacts, mutateConversation, handleReadMessage]);

  // Función para cambiar el estado del chat
  const changeEstadoChat = useCallback((id: string, estado: boolean) => {
    mutateContacts((currentData: any) => {
      return currentData.map((msg: any) =>
        msg.id_whmem === id ? { ...msg, leido_whcha: estado, no_leidos_whcha: 0 } : msg
      );
    }, false);
  }, [mutateContacts]);

  // Memorizar el valor de selectedContact
  const memoizedSelectedContact = useMemo(() => selectedContact, [selectedContact]);

  return {
    contacts,
    contactsLoading,
    conversation,
    conversationLoading,
    errorConversation,
    paramGetMensajes,
    setParamGetMensajes,
    selectedContact: memoizedSelectedContact,
    setSelectedContact,
    changeEstadoChat,
    hasSocketConnection,
  };
}