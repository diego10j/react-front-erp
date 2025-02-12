import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useGetChats, useGetMensajes } from 'src/api/whatsapp';
import { CONFIG } from 'src/config-global';
import { IGetMensajes } from 'src/types/whatsapp';

const socket = io(CONFIG.webSocketUrl, {
    transports: ["websocket", "polling"],
    withCredentials: true, // Permite enviar cookies o encabezados de autenticación
});
// ----------------------------------------------------------------------

export function useWebSocketChats() {
    const [paramGetMensajes, setParamGetMensajes] = useState<IGetMensajes>({ telefono: "000000000000" });
    const { contacts, contactsLoading, mutate: mutateContacts } = useGetChats();
    const [selectedContact, setSelectedContact] = useState<any>(null);

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

    // Handle cuando se recibe un mensaje leido
    const handleReadMessage = (id: string) => {
        // Actualizar el estado de 'status_whmem' a 'read' para el mensaje que coincida con el teléfono

        if (contacts.length > 0) {
            let currentTelefono = '';
            const updatedContacts = contacts.map((msg: any) => {
                if (msg.id_whmem === id) {
                    currentTelefono = msg.wa_id_whmem;
                    return { ...msg, status_whmem: 'read' }; // Cambia el estado a 'read'
                }
                return msg; 
            });
            // Actualizamos el estado del contacto
            mutateContacts(updatedContacts);
            // Actualiza a leido los mensajes si el telefono seleccionado es igual al del id del chat 
            if (currentTelefono === telefonoRef.current) {
                const updatedConversation = conversation.map((msg: any) => {
                    if (msg.id_whmem === id) {
                        return { ...msg, status_whmem: 'read' }; // Cambia el estado a 'read'
                    }
                    return msg; 
                });
                // Actualizamos el estado de la conversación con los nuevos valores
                mutateConversation(updatedConversation);
            }
        }

    };

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
    }, [mutateContacts, mutateConversation, conversation]);

    return {
        contacts,
        contactsLoading,
        conversation,
        conversationLoading,
        errorConversation,
        paramGetMensajes,
        setParamGetMensajes,
        selectedContact,
        setSelectedContact
    };
}
