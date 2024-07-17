import { useState, useEffect, useCallback } from 'react';

import { getUrlImagen, sendUploadImage } from 'src/api/sistema/files';

import type { UseUploadImagePropsReturnProps } from './types';


export default function UseUploadImage(): UseUploadImagePropsReturnProps {

  const [file, setFile] = useState<string | null>(null);
  const [url, setUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (file) {
      setUrl(getUrlImagen(file));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const onDropImage = useCallback(async (newFile: File) => {
    if (newFile) {
      setLoading(true)
      const data = await sendUploadImage(newFile);
      setFile(data);
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
