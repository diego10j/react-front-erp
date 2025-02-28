import type { IGetMensajes } from 'src/types/whatsapp';

import io from 'socket.io-client';
import { useRef, useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config-global';
import { useGetChats, useGetMensajes } from 'src/api/whatsapp';

// ----------------------------------------------------------------------
const socket = io(CONFIG.webSocketUrl, {
  transports: ["websocket", "polling"],
  withCredentials: true, // Permite enviar cookies o encabezados de autenticación
});
// ----------------------------------------------------------------------

export function useWebSocketChats() {
  const [paramGetMensajes, setParamGetMensajes] = useState<IGetMensajes>({ telefono: "000000000000" });
  const { contacts, contactsLoading, mutate: mutateContacts } = useGetChats();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [hasSocketConnection, setHasSocketConnection] = useState(false); // Estado para la conexión del socket


  const {
    dataResponse: conversation,
    isLoading: conversationLoading,
    error: errorConversation,
    mutate: mutateConversation
  } = useGetMensajes(paramGetMensajes);

  // Ref para almacenar el teléfono actualizado
  const telefonoRef = useRef(paramGetMensajes.telefono);

  // Efecto para actualizar paramGetMensajes cuando se selecciona un contacto
  useEffect(() => {
    if (selectedContact && selectedContact.wa_id_whmem) {
      if (paramGetMensajes.telefono !== selectedContact.wa_id_whmem) {
        setParamGetMensajes({ telefono: selectedContact.wa_id_whmem });
      }
    }
  }, [selectedContact, paramGetMensajes]);

  // Actualizar el teléfono de la ref cada vez que paramGetMensajes cambie
  useEffect(() => {
    telefonoRef.current = paramGetMensajes.telefono;
  }, [paramGetMensajes]);


  // Efecto para manejar la conexión y desconexión del socket
  useEffect(() => {
    const handleConnect = () => {
      setHasSocketConnection(true); // Conexión establecida
    };

    const handleDisconnect = () => {
      setHasSocketConnection(false); // Conexión perdida
    };

    const handleConnectError = () => {
      console.log('errorroro conexion');
      setHasSocketConnection(false); // Error de conexión
    };

    // Escuchar eventos de conexión y desconexión
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    // Limpiar listeners cuando el componente se desmonte
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, []);


  const handleReadMessage = useCallback(async (id: string) => {
    const currentTelefono = selectedContact?.wa_id_whmem;

    await mutateContacts((currentData: any) => {
      // Preparamos los contactos actualizados
      const updatedContacts = currentData.map((msg: any) => {
        if (msg.id_whmem === id) {
          return { ...msg, status_whmem: 'read' }; // Cambia el estado a 'read'
        }
        return msg;
      });

      // Devuelve la lista de contactos actualizada
      return [...updatedContacts];
    },
      false);
    // console.log(`${id}   currentTelefono ${currentTelefono}  telefonoRef.current  ${telefonoRef.current}`);
    if (currentTelefono === telefonoRef.current) {

      await mutateConversation((currentData: any) => {
        const updatedConversation = currentData.map((msg: any) => {
          if (msg.id_whmem === id) {
            return { ...msg, status_whmem: 'read' }; // Cambia el estado a 'read'
          }
          return msg;
        });
        // Devuelve la conversacion actualizada
        return [...updatedConversation];
      },
        false);
    }
  }, [selectedContact, mutateContacts, mutateConversation]);

  // Efecto para escuchar el evento 'onReadMessage' desde el socket
  useEffect(() => {
    const handleNewMessage = (telefono: string) => {
      mutateContacts(); // Actualizar la lista de contactos cuando llega un nuevo mensaje
      if (telefono === telefonoRef.current) {
        mutateConversation(); // Si el teléfono coincide, actualizar la conversación
      }
    };

    const handleOnReadMessage = (id: string) => {
      // Llamar a la función para manejar el cambio de estado de 'read'
      handleReadMessage(id);
    };

    socket.on('newMessage', handleNewMessage); // Escuchar los nuevos mensajes
    socket.on('onReadMessage', handleOnReadMessage); // Escuchar cuando se marca un mensaje como leido

    // Limpiar las suscripciones cuando el componente se desmonte
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('onReadMessage', handleOnReadMessage);
    };
  }, [mutateContacts, mutateConversation, conversation, handleReadMessage]);


  const changeEstadoChat = useCallback((id: string, estado: boolean) => {
    mutateContacts((currentData: any) => {
      // Preparamos los contactos actualizados
      const updatedContacts = currentData.map((msg: any) => {
        if (msg.id_whmem === id) {
          return { ...msg, leido_whcha: estado, no_leidos_whcha: 0 }; // Cambia el estado a 'read'
        }
        return msg;
      });
      // Devuelve la lista de contactos actualizada
      return [...updatedContacts];
    },
      false);

  }, [mutateContacts]);

  return {
    contacts,
    contactsLoading,
    conversation,
    conversationLoading,
    hasSocketConnection,
    errorConversation,
    paramGetMensajes,
    setParamGetMensajes,
    selectedContact,
    setSelectedContact,
    changeEstadoChat
  };
}
