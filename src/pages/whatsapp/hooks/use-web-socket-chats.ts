import type { IGetMensajes, IListChat } from 'src/types/whatsapp';

import io from 'socket.io-client';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/config-global';
import { useGetChats, setChatNoLeido, useGetMensajes, setChatFavorito, useGetListas, setEtiquetaChat } from 'src/api/whatsapp';

// ----------------------------------------------------------------------
const socket = io(CONFIG.webSocketUrl, {
  transports: ["websocket", "polling"],
  withCredentials: true, // Permite enviar cookies o encabezados de autenticación
});

const defaulList: IListChat = {
  "ide_whlis": -1,
  "nombre_whlis": "Todos",
  total_chats: null,
  icono_whlis: 'mynaui:list-check-solid'
};
// ----------------------------------------------------------------------
export function useWebSocketChats() {

  const [paramGetMensajes, setParamGetMensajes] = useState<IGetMensajes>({ telefono: "000000000000" });
  const { contacts, contactsLoading, mutate: mutateContacts } = useGetChats();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const { dataResponse: lists, isLoading: listsLoading } = useGetListas();
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [selectList, setSelectList] = useState<IListChat>(defaulList);

  useEffect(() => {
    if (selectList.ide_whlis === -1) {
      setFilteredContacts(contacts);
    } else if (selectList.ide_whlis === -2) {
      setFilteredContacts(contacts.filter((contact: any) => !contact.leido_whcha));
    } else if (selectList.ide_whlis === -3) {
      setFilteredContacts(contacts.filter((contact: any) => contact.favorito_whcha));
    }
  }, [selectList, contacts]);


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
    try {
      setChatNoLeido({
        telefono: paramGetMensajes.telefono,
        leido: estado
      });
    }
    catch (error) {
      console.error('Error changeEstadoChat:', error);
    }

    mutateContacts((currentData: any) => {
      // Preparamos los contactos actualizados
      const updatedContacts = currentData.map((msg: any) => {
        if (msg.id_whmem === id) {
          const updatedMsg = { ...msg, leido_whcha: estado, no_leidos_whcha: 0 };

          // Si el mensaje actualizado es el selectedContact, actualízalo
          if (selectedContact && selectedContact.id_whmem === id) {
            setSelectedContact(updatedMsg);
          }
          return updatedMsg;
        }
        return msg;
      });
      // Devuelve la lista de contactos actualizada
      return [...updatedContacts];
    },
      false);
  }, [mutateContacts, paramGetMensajes.telefono, selectedContact]);


  const changeUrlMediaFile = useCallback((id: string, url: string, size: number) => {
    mutateConversation((currentData: any) => {
      // Preparamos los contactos actualizados
      const updatedContacts = currentData.map((msg: any) => {
        if (msg.id_whmem === id) {
          return { ...msg, attachment_url_whmem: url, attachment_size_whmem: size };
        }
        return msg;
      });
      // Devuelve la lista de contactos actualizada
      return [...updatedContacts];
    },
      false);

  }, [mutateConversation]);

  // Función utilitaria para actualizar el estado de los contactos
  const updateContacts = useCallback(
    (updateFn: (msg: any) => any) => {
      mutateContacts((currentData: any) => {
        const updatedContacts = currentData.map((msg: any) => {
          if (msg.wa_id_whmem === paramGetMensajes.telefono) {
            const updatedMsg = updateFn(msg);
            // Si el mensaje actualizado es el selectedContact, actualízalo
            if (selectedContact && selectedContact.wa_id_whmem === paramGetMensajes.telefono) {
              setSelectedContact(updatedMsg);
            }
            return updatedMsg;
          }
          return msg;
        });
        return [...updatedContacts];
      }, false);
    },
    [mutateContacts, paramGetMensajes, selectedContact, setSelectedContact]
  );



  // Función para marcar un chat como no leído
  const changeUnReadChat = useCallback(() => {
    try {
      setChatNoLeido({
        telefono: paramGetMensajes.telefono,
        leido: false,
      });
      updateContacts((msg) => ({ ...msg, leido_whcha: false }));
    } catch (error) {
      console.error('Error en changeUnReadChat:', error);
    }
  }, [setChatNoLeido, paramGetMensajes, updateContacts]);

  // Función para marcar un chat como favorito
  const changeFavoriteChat = useCallback(
    (isFavorite: boolean) => {
      try {
        setChatFavorito({
          telefono: paramGetMensajes.telefono,
          favorito: isFavorite,
        });
        updateContacts((msg) => ({ ...msg, favorito_whcha: isFavorite }));
      } catch (error) {
        console.error('Error en changeFavoriteChat:', error);
      }
    },
    [setChatFavorito, paramGetMensajes, updateContacts]
  );

  // Función para cambiar la etiqueta de un chat
  const changeLabelChat = useCallback(
    (label: number, color: string) => {
      try {
        setEtiquetaChat({
          telefono: paramGetMensajes.telefono,
          etiqueta: label,
        });
        updateContacts((msg) => ({ ...msg, ide_wheti: label, color_wheti: color }));
      } catch (error) {
        console.error('Error en changeLabelChat:', error);
      }
    },
    [setEtiquetaChat, paramGetMensajes, updateContacts]
  );


  const totalUnReadChats = useMemo(
    () => contacts.filter((contact: any) => !contact.leido_whcha).length,
    [contacts]
  );

  const totalFavoriteChats = useMemo(
    () => contacts.filter((contact: any) => contact.favorito_whcha).length,
    [contacts]
  );

  return {
    contacts,
    contactsLoading,
    conversation,
    conversationLoading,
    errorConversation,
    paramGetMensajes,
    totalUnReadChats,
    totalFavoriteChats,
    filteredContacts,
    selectedContact,
    lists,
    listsLoading,
    selectList,
    setSelectList,
    setParamGetMensajes,
    setSelectedContact,
    changeEstadoChat,
    changeUrlMediaFile,
    changeUnReadChat,
    changeFavoriteChat,
    changeLabelChat
  };
}
