// form
import { forwardRef, useEffect, useImperativeHandle } from 'react';
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
import { CustomColumn } from '../dataTable';





// ----------------------------------------------------------------------

type Props = {
  currentValues: object;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  columns: Column[];
  isUpdate: boolean;
  loading: boolean;
  schema?: Yup.ObjectSchema<any | undefined, object>
  customColumns?: Array<CustomColumn>;
  // events
  onSave: (data: object) => void;
};


const FormTable = forwardRef(({ currentValues, columns, customColumns, setColumns, isUpdate, loading, schema, onSave }: Props, ref) => {

  useImperativeHandle(ref, () => ({
    setValue
  }));

  const methods = useForm({
    resolver: yupResolver(schema),
  });


  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  useEffect(() => {
    console.log('aaa1');
    if (Object.keys(currentValues).length > 0) {
      reset(currentValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValues]);


  useEffect(() => {
    console.log('yyyyyyyyy');
    if (columns.length > 0) {
      console.log('xxxxxx');
      readCustomColumns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);



  const readCustomColumns = (): void => {
    if (customColumns) {
      customColumns?.forEach(async (_column) => {
        const currentColumn = columns.find((_col) => _col.name === _column.name.toLowerCase());
        if (currentColumn) {
          currentColumn.visible = 'visible' in _column ? _column.visible : currentColumn.visible;
          currentColumn.label = 'label' in _column ? _column?.label : currentColumn.label;
          currentColumn.order = 'order' in _column ? _column.order : currentColumn.order;
          currentColumn.decimals = 'decimals' in _column ? _column.decimals : currentColumn.decimals;
          currentColumn.comment = 'comment' in _column ? _column.comment : currentColumn.comment;
          currentColumn.upperCase = 'upperCase' in _column ? _column.upperCase : currentColumn.upperCase;
          currentColumn.onChange = 'onChange' in _column ? _column.onChange : undefined;
          setColumns(oldArray => [...oldArray, currentColumn]);
        }
        else {
          throw new Error(`ERROR. la columna ${_column.name} no existe`);
        }
      });
      // ordena las columnas
      setColumns(columns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1)));

    }
  }



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
      {Object.keys(currentValues).length > 0 && (
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
  )

});
export default FormTable;