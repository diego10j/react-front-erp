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
