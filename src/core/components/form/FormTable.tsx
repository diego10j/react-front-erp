// form
import { useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Column } from '../../types';
import { toTitleCase } from '../../../utils/stringUtil';
import FrmCalendar from './FrmCalendar';
import FrmCheckbox from './FrmCheckbox';
import FrmTextField from './FrmTextField';





// ----------------------------------------------------------------------

type Props = {
  currentValues: object;
  columns: Column[];
  isUpdate: boolean;
  loading: boolean;
  schema?: Yup.ObjectSchema<any | undefined, object>
  // events
  onSave: (data: object) => void;
};


export default function FormTable({ currentValues, columns, isUpdate, loading, schema, onSave }: Props) {


  const defaultValues = useMemo(
    () => (
      currentValues
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentValues]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);



  const onSubmit = async (data: any) => {
    try {
      await onSave(data);
      //  reset();
      // console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };


  // ******* RENDER COMPONENT
  // eslint-disable-next-line consistent-return
  const renderComponent = (column: Column) => {
    if (column.visible === true) {
      switch (column.component) {
        case 'Text':
          if (column.dataType === 'Number') return <FrmTextField key={column.order} type="number" column={column} label={toTitleCase(column.label)} />;
          return <FrmTextField key={column.order} column={column} label={toTitleCase(column.label)} />;
        case 'Checkbox':
          return <FrmCheckbox key={column.order} column={column} label={toTitleCase(column.label)} />;
        case 'Calendar':
          return <FrmCalendar key={column.order} column={column} label={toTitleCase(column.label)} />;
        default:
          return <FrmTextField key={column.order} column={column} label={toTitleCase(column.label)} />;
      }
    }
  }


  // *******

  return (
    <>
      {Object.keys(defaultValues).length > 0 && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>


            <Grid container >


              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                    {columns.map((_column: any) => (
                      renderComponent(_column)
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
