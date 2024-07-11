import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { getUrlImagen, sendUploadImage } from 'src/api/upload';

import { Upload, UploadBox, UploadAvatar } from '../upload';

import type { UploadProps } from '../upload';

// ----------------------------------------------------------------------

type Props = UploadProps & {
  name: string;
  apiUpload?: boolean;
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

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
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

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
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
