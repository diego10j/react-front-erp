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

export type ISetEtiquetaChat = {
  telefono: string;
  etiqueta: number;
};

export type IListChat = {
  ide_whlis: number;
  nombre_whlis: string;
  color_whlis?: string | null;
  descripcion_whlis?: string | null;
  icono_whlis?: string;
  total_chats?: number | null;
};

export type IEtiquetasChat = {
  ide_wheti: number,
  nombre_wheti: string,
  color_wheti: string ,
  descripcion_wheti?: string | null
};

export type ISaveListasContacto = {
  listas: number[];
  telefono: string;
};

export type ISearchContacto = {
  texto: string;
  lista?: number;
};