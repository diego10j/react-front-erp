
import type { ZodObject, ZodRawShape } from 'zod';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, CardContent } from '@mui/material';

import { isDefined } from 'src/utils/common-util';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';

import FrmCalendar from './FrmCalendar';
import FrmCheckbox from './FrmCheckbox';
import FrmDropdown from './FrmDropdown';
import { save } from '../../../api/core';
import FrmTextField from './FrmTextField';
import FrmRadioGroup from './FrmRadioGroup';
import FormTableToolbar from './FormTableToolbar';
import FormTableSkeleton from './FormTableSkeleton';

import type { Column } from '../../types';
import type { FormTableProps } from './types';

const FormTable = forwardRef(({ useFormTable, customColumns, eventsColumns, schema, showToolbar = true, showSubmit = true, numSkeletonCols }: FormTableProps, ref) => {


  useImperativeHandle(ref, () => ({
    getValues: methods.getValues,
    setValue: methods.setValue,
  }));

  const { currentValues, columns, setColumns, primaryKey, isValidSave, saveForm, initialize, onRefresh, isLoading, isUpdate, getVisibleColumns, isPendingChanges, updateChangeColumn, setCurrentValues, setColsUpdate, mutate } = useFormTable;
  const [dynamicSchema, setDynamicSchema] = useState<ZodObject<ZodRawShape>>(zod.object({}));

  useEffect(() => {
    if (initialize === true) {
      // Solo lee si no se a inicializado la data
      generateSchema();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize]);


  type ITypeSchema = zod.infer<typeof dynamicSchema>;

  const methods = useForm<ITypeSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(dynamicSchema),
    defaultValues: currentValues
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  const generateSchema = (): void => {
    // Columnas personalizadas
    const updatedColumns = columns.map(col => {
      if (customColumns) {
        const customColumn = customColumns.find(_col => _col.name.toLowerCase() === col.name);
        if (customColumn) {
          col = {
            ...col,
            visible: 'visible' in customColumn ? customColumn.visible : col.visible,
            label: 'label' in customColumn ? customColumn.label : col.label,
            order: 'order' in customColumn ? customColumn.order : col.order,
            decimals: 'decimals' in customColumn ? customColumn.decimals : col.decimals,
            comment: 'comment' in customColumn ? customColumn.comment : col.comment,
            upperCase: 'upperCase' in customColumn ? customColumn.upperCase : col.upperCase,
            formControlled: 'formControlled' in customColumn ? customColumn.formControlled : 'visible' in customColumn ? customColumn.visible : col.visible,
            dropDown: 'dropDown' in customColumn ? customColumn.dropDown : col.dropDown,
            radioGroup: 'radioGroup' in customColumn ? customColumn.radioGroup : col.radioGroup,
            component: 'dropDown' in customColumn ? 'Dropdown' : 'radioGroup' in customColumn ? 'RadioGroup' : col.component,
          };
        }
      }
      // Eventos
      if (eventsColumns) {
        const colEvent = eventsColumns.find(_col => _col.name === col.name);
        if (colEvent?.onChange) {
          col.onChange = colEvent.onChange;
        }
      }
      // Valores en blanco para componentes
      if (['Number', 'Date', 'Time', 'DateTime'].includes(col.dataType) && currentValues[col.name] === '') {
        currentValues[col.name] = undefined;
      } else if (col.dataType === 'Boolean' && currentValues[col.name] === '') {
        currentValues[col.name] = false;
      }
      // primaryKey siempre formControlled = true
      // if (col.name === primaryKey) {
      //   col.formControlled = true;
      // }

      return col;
    });

    if (customColumns) {
      // Throw error if any custom column does not exist in the columns
      customColumns.forEach(_column => {
        if (!columns.some(col => col.name === _column.name.toLowerCase())) {
          throw new Error(`ERROR. la columna ${_column.name} no existe`);
        }
      });
    }
    // Generar el esquema
    const values = currentValues;
    updatedColumns.forEach((column: Column) => {
      if (isDefined(column.formControlled) === false || column.name === primaryKey) {
        // para columnas no visibles que se contralan
        column.formControlled = true;
      }
      // Elimina columnas no visibles y no controladas del currentValues
      if (column.visible === false && column.formControlled === false) {
        delete values[column.name];
      }
    });


    // Ordenar las columnas actualizadas
    updatedColumns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1));

    // Actualizar el estado de columns
    setColumns(updatedColumns);
    // Actualizar el estado de currentValues

    // console.log(values);
    setCurrentValues(values);


    const schemaObject: { [key: string]: any } = {};
    updatedColumns.forEach(column => {
      // console.log(column);
      if (column.visible === true || column.formControlled === true) {
        let fieldSchema: any;
        if (column.name === primaryKey) {
          fieldSchema = zod.any();
        }
        else {
          switch (column.dataType) {
            case 'Number':
              fieldSchema = zod.number();
              if (column.required) {
                fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
              }
              break;
            case 'String':
              fieldSchema = zod.string();
              if (column.required) {
                fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
              }
              if (column.length) {
                fieldSchema = fieldSchema.max(column.length, { message: `${column.label} debe tener máximo ${column.length} caracteres!` });
              }
              break;
            // case 'Boolean':
            //   fieldSchema = zod.boolean();
            //   if (column.required) {
            //     fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
            //   }
            //   break;
            default:
              fieldSchema = zod.any();
          }
        }
        schemaObject[column.name] = fieldSchema;
      }
    });
    // console.log(schemaObject);
    const generatedSchema = zod.object(schemaObject)
    setDynamicSchema(schema ? generatedSchema.merge(schema) : generatedSchema);
    reset(values);
  };


  const onSubmit = handleSubmit(async (data) => {
    try {
      if (await isValidSave(data)) {
        const param = {
          listQuery: saveForm(data)
        }
        await save(param);
        setCurrentValues(data);
        setColsUpdate([]);
        mutate();
        toast.success(!isUpdate ? 'Creado con exito!' : 'Actualizado con exito!');
      }
      // console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });



  // ******* RENDER COMPONENT
  // eslint-disable-next-line consistent-return
  const renderComponent = (column: Column) => {
    if (column.visible === true) {
      switch (column.component) {
        case 'Text':
          return <FrmTextField key={column.order} column={column} updateChangeColumn={updateChangeColumn} />;
        case 'Checkbox':
          return <FrmCheckbox key={column.order} column={column} updateChangeColumn={updateChangeColumn} />;
        case 'Calendar':
          return <FrmCalendar key={column.order} column={column} updateChangeColumn={updateChangeColumn} />;
        case 'Dropdown':
          return <FrmDropdown key={column.order} column={column} updateChangeColumn={updateChangeColumn} />;
        case 'RadioGroup':
          return <FrmRadioGroup key={column.order} column={column} updateChangeColumn={updateChangeColumn} />;
        default:
          return <FrmTextField key={column.order} column={column} updateChangeColumn={updateChangeColumn} />;
      }
    }
  }


  // *******

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      {
        initialize === false || isLoading === true ? (
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
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isPendingChanges()}>
                      Guardar
                    </LoadingButton>
                  </Stack>
                )}
              </Card>
            </Grid>
          </Grid>
        )
      }
    </Form >

  )

});
export default FormTable;
