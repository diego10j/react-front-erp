

export type UseUploadImagePropsReturnProps = {
  file: string | null;
  setFile: React.Dispatch<React.SetStateAction<string | null>>;
  url: string | undefined;
  loading: boolean;
  // events
  onDropImage: (newFile: File) => void;
};


export type UploadImageProps = {
  useUploadImage: UseUploadImagePropsReturnProps;
  maxSize?: number, // por defecto maximo peso del archivo 3.1MB
  type?: 'avatar' | 'image';
};
