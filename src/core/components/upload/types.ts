

export type UseUploadImagePropsReturnProps = {
    file: File | string | null;
    setFile: React.Dispatch<React.SetStateAction<File | string | null>>;
    url: string | undefined;
    loading: boolean;
    // events
    onDropImage: (newFile: File) => void;
};


export type UploadImageProps = {
    useUploadImage: UseUploadImagePropsReturnProps;
    maxSize?: number, // por defecto maximo peso del archivo 3.1MB
};
