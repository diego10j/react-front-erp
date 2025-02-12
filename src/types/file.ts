import type { IDateValue, IDatePickerControl } from './common';
// ----------------------------------------------------------------------


export type IFileFilters = {
  name: string;
  type: string[];
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

// ----------------------------------------------------------------------

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  ide_arch?: number;
  usuario_ingre?: string;
  tags: string[];
  totalFiles?: number;
  isFavorited: boolean;
  shared: IFileShared[] | null;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  ide_arch?: number;
  usuario_ingre?: string;
  tags: string[];
  isFavorited: boolean;
  shared: IFileShared[] | null;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IFile = IFileManager | IFolderManager;


export type IgetFiles = {
  mode: string;
  ide_archi?: number;
  ide_inarti?: number;
};

export type ICreateFolder = {
  folderName: string;
  sis_ide_arch?: number;
  ide_inarti?: number;
};

export type IDeleteFiles = {
  values: string[];
  trash:boolean;
};

export type IRenameFile = {
  fileName: string;
  id: string;
};

export type IFavoriteFile = {
  favorite: boolean;
  id: string;
};
