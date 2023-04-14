// form
import { useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { Box, Card, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Column } from '../../types';
import FormTextField from './FormTextField';

// ----------------------------------------------------------------------

type Props = {

  currentValues: object;
  columns: Column[];
  isUpdate: boolean;
  loading: boolean;
  schema?: Yup.ObjectSchema<any | undefined, object>

  children?: React.ReactNode;
};


type FormValuesProps = {
  ide_empr: number;
  nom_empr: string | null;
  mail_empr: string | null;
  identificacion_empr: string | null;
};


export default function FormTable({ currentValues, columns, isUpdate, loading, schema, children }: Props) {

  const { enqueueSnackbar } = useSnackbar();


  const defaultValues = useMemo(
    () => (
      currentValues
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentValues]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues
  });


  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      console.log(defaultValues);
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdate, defaultValues]);


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;



  const onSubmit = async (data: FormValuesProps) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      //  reset();
      enqueueSnackbar(!isUpdate ? 'Create success!' : 'Update success!');

      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      {Object.keys(defaultValues).length > 0 && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>


            <Grid container >


              <Grid item >
                <Card sx={{ p: 3 }}>
                  <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(2, 1fr)',
                    }}
                  >

                    {columns.map((col: any) => (
                      <FormTextField key={col.order} name={col.name} label={col.label} />
                    ))}
                  </Box>

                  <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Save Changes
                    </LoadingButton>
                  </Stack>
                </Card>
              </Grid>
            </Grid>


          </form>
        </FormProvider>
      )}
    </>
  );
}
