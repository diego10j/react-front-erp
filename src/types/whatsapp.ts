export type IGetMensajes = {
  telefono: string;
};

export type IEnviarMensajes = {
  telefono: string;
  texto: string;
};


export type IGetUrl = {
  id: string;
};

export type ISetChatFavorito = {
  telefono: string;
  favorito: boolean;
};

export type ISetChatNoLeido = {
  telefono: string;
  leido: boolean;
};


export type IListChat = {
  ide_whlis: number;
  nombre_whlis: string;
  color_whlis?: string | null;
  descripcion_whlis?: string | null;
  icono_whlis?: string;
  total_chats?: number | null;
};
