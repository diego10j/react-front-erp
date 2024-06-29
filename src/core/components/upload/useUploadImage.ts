import { useState, useCallback } from 'react';

import { sendUploadImage } from '../../../api/upload';

import type { UseUploadImagePropsReturnProps } from './types';


export default function UseUploadImage(): UseUploadImagePropsReturnProps {

    const [file, setFile] = useState<File | string | null>(null);
    const [url, setUrl] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);


    const onDropImage = useCallback(async (newFile: File) => {
        if (newFile) {
            setLoading(true)
            const data = await sendUploadImage(newFile);
            setFile(data);
            setUrl(data);
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setFile]);

    return {
        file,
        url,
        loading,
        setFile,
        onDropImage,
    }
}
