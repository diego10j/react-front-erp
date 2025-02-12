import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { getUrlImagen, sendUploadImage } from 'src/api/sistema/files';

import { Upload, UploadBox, UploadAvatar } from '../upload';

import type { UploadProps } from '../upload';

// ----------------------------------------------------------------------

type Props = UploadProps & {
  name: string;
  apiUpload?: boolean;
  onDrop?: () => void;
};

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, apiUpload = false, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <div>
            <UploadAvatar value={apiUpload === false ? field.value : getUrlImagen(field.value)} error={!!error} onDrop={onDrop} {...other} />

            {!!error && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, apiUpload = false, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox value={apiUpload === false ? field.value : getUrlImagen(field.value)} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, onDrop, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const handleDrop = async (acceptedFiles: File[]) => {
          const fields = field.value || [];

          // Procesa cada archivo de forma asíncrona
          const processedFiles = await Promise.all(
            acceptedFiles.map(async (file) => {
              // Asigna la preview para cada archivo
              const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
              });

              // Sube la imagen y espera su respuesta
              const data = await sendUploadImage(newFile);

              // Devuelve el archivo procesado (puedes modificar según tu lógica)
              return data;
            })
          );

          // Si es múltiple, agrega los archivos nuevos a los ya existentes
          const value = multiple ? [...fields, ...processedFiles] : processedFiles[0];

          // Actualiza el valor del formulario
          setValue(name, value, { shouldValidate: true });

          // Si hay una función onDrop, ejecútala
          if (onDrop) {
            onDrop();
          }
        };

        return (
          <Upload
            {...uploadProps}
            value={field.value ? field.value.map((file: string) => (typeof file === 'string' ? getUrlImagen(file) : file)) : field.value}
            onDrop={handleDrop}
            {...other}
          />
        );

      }}
    />
  );
}


/** TODO call service web delete file */
export function RHFUploadImage({ name, helperText, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple: false,
          accept: { 'image/*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = async (acceptedFiles: File[]) => {
          const file = acceptedFiles[0];
          const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
          if (file) {
            const data = await sendUploadImage(newFile);
            // setValue('foto_inarti', newFile, { shouldValidate: true });
            setValue(name, data, { shouldValidate: true });
          }
        };

        return <Upload {...uploadProps} value={field.value === null ? field.value : getUrlImagen(field.value)} onDrop={onDrop} onDelete={() => setValue(name, null)}  {...other} />;
      }}
    />
  );
}
