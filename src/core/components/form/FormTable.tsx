// form
import { useForm, FormProvider } from 'react-hook-form';
import { useEffect, forwardRef, useImperativeHandle } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, CardContent } from '@mui/material';

import { Column } from '../../types';
import FrmCalendar from './FrmCalendar';
import FrmCheckbox from './FrmCheckbox';
import FrmDropdown from './FrmDropdown';
import { FormTableProps } from './types';
import FrmTextField from './FrmTextField';
import FrmRadioGroup from './FrmRadioGroup';
import FormTableToolbar from './FormTableToolbar';
import FormTableSkeleton from './FormTableSkeleton';
import { toTitleCase } from '../../../utils/stringUtil';

const FormTable = forwardRef(({ useFormTable, customColumns, eventsColumns, schema , showToolbar = true, showSubmit = true, numSkeletonCols }: FormTableProps, ref) => {


  useImperativeHandle(ref, () => ({
    setValue,
    getValues,
    readCustomColumns
  }));

  const { currentValues, columns, setColumns, onSave, initialize, onRefresh, loading, getVisibleColumns } = useFormTable;

  const methods = useForm({
   //  resolver: yupResolver(schema),
  });

  const {
    reset,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (initialize === true) {
      // Solo lee si no se a inicializado la data
      readCustomColumns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);


  useEffect(() => {
    //  if (Object.keys(currentValues).length > 0) {
    reset(currentValues);
    //  }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValues]);


  /**
   * Lee las columnas customizadas, esta función se llama desde el useFormTable
   * @param _columns
   * @returns
   */
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

          if ('dropDown' in _column) {
            currentColumn.dropDown = _column.dropDown;
            currentColumn.component = 'Dropdown'
          }

          if ('radioGroup' in _column) {
            currentColumn.radioGroup = _column.radioGroup;
            currentColumn.component = 'RadioGroup'
          }

         // ****  currentColumn.onChange = 'onChange' in _column ? _column.onChange : undefined;
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
          if (column.dataType === 'Number') return <FrmTextField key={column.order} type="number" column={column} />;
          return <FrmTextField key={column.order} column={column} />;
        case 'Checkbox':
          return <FrmCheckbox key={column.order} column={column} label={toTitleCase(column.label)} />;
        case 'Calendar':
          return <FrmCalendar key={column.order} column={column} />;
        case 'Dropdown':
          return <FrmDropdown key={column.order} column={column} label={toTitleCase(column.label)} />;
        case 'RadioGroup':
          return <FrmRadioGroup key={column.order} column={column} row spacing={4} />;
        default:
          return <FrmTextField key={column.order} column={column} />;
      }
    }
  }


  // *******

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {initialize === false || loading === true ? (
          <FormTableSkeleton showToolbar={showToolbar} showSubmit={showSubmit} numColumns={getVisibleColumns().length || numSkeletonCols} />
        ) : (
          <Grid container >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                {showToolbar && (
                  <FormTableToolbar onRefresh={onRefresh} onExportExcel={onRefresh} />
                )}
                <CardContent>
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
                </CardContent>
                {showSubmit && (
                  <Stack alignItems="flex-end" sx={{ px: 3, mb: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      Guardar
                    </LoadingButton>
                  </Stack>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </form>
    </FormProvider>
  )

});
export default FormTable;
