
import type { ZodObject, ZodRawShape } from 'zod';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Tooltip, Divider, MenuItem, CardHeader, IconButton, CardContent } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { isDefined } from 'src/utils/common-util';

import { toast } from 'src/components/snackbar';
import { Form, schemaHelper } from 'src/components/hook-form';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import FrmCalendar from './FrmCalendar';
import FrmCheckbox from './FrmCheckbox';
import FrmDropdown from './FrmDropdown';
import { DebugForm } from './DegugForm';
import { save } from '../../../api/core';
import FrmTextField from './FrmTextField';
import FrmRadioGroup from './FrmRadioGroup';
import FormTableSkeleton from './FormTableSkeleton';
import { ConfigIcon, OptionsIcon, RefreshIcon, DownloadIcon } from '../icons/CommonIcons';

import type { Column } from '../../types';
import type { FormTableProps } from './types';

// ----------------------------------------------------------------------
const NO_CHANGE_COLUMNS = ['fecha_ingre', 'hora_ingre', 'usuario_ingre', 'fecha_actua', 'hora_actua', 'usuario_actua'];

const FormTable = forwardRef(({
  useFormTable,
  customColumns,
  eventsColumns,
  schema,
  showOptionsForm = true,
  showSubmit = true,
  numSkeletonCols,
  hrefPath,
  children,
  onSubmit }: FormTableProps, ref) => {


  useImperativeHandle(ref, () => ({
    customColumns,
    getValues: methods.getValues,
    setValue: methods.setValue,
    isSubmitting: methods.formState.isSubmitting,
    isValidating: methods.formState.isValidating,
    isSubmitted: methods.formState.isSubmitted,
    isSubmitSuccessful: methods.formState.isSubmitSuccessful,
    columnChange,
    renderOptionsForm,
    methods
  }));

  const {
    currentValues,
    columns,
    setColumns,
    primaryKey,
    isValidSave,
    saveForm,
    initialize,
    onRefresh,
    isLoading,
    isUpdate,
    getVisibleColumns,
    setCurrentValues,
    isChangeDetected,
    setIsChangeDetected,
    columnChange,
    setColumnChange,
    mutate } = useFormTable;
  const [dynamicSchema, setDynamicSchema] = useState<ZodObject<ZodRawShape>>(zod.object({}));
  const router = useRouter();
  const [processing, setProcessing] = useState(true);




  const popover = usePopover();
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    if (initialize === true) {
      // Solo lee si no se a inicializado la data
      generateSchema();
      setProcessing(false);
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
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  // Detectar cambios en los valores del formulario
  useEffect(() => {
    const subscription = watch((values) => {
      if (initialize === true) {

        // Detectar los cambios en el formulario y excluir las columnas no rastreadas
        const changedColumns = Object.keys(values).filter(
          (key) => values[key] !== currentValues[key] && !NO_CHANGE_COLUMNS.includes(key)
        );

        // Determinar si se han detectado cambios
        const changesDetected = changedColumns.length > 0;

        // Actualizar el estado de detección de cambios
        setIsChangeDetected(changesDetected);

        // Actualizar las columnas cambiadas sin duplicados
        if (changesDetected) {
          setColumnChange((prevColumns) => [...new Set([...prevColumns, ...changedColumns])]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, currentValues, setIsChangeDetected, setColumnChange, initialize]);


  const generateSchema = (): void => {
    // Columnas personalizadas

    const updatedColumns = columns.map(col => {
      if (customColumns) {
        const customColumn = customColumns.find(_col => _col.name.toLowerCase() === col.name.toLowerCase());
        if (customColumn) {
          col = {
            ...col, visible: Object.prototype.hasOwnProperty.call(customColumn, 'visible') ? customColumn.visible : col.visible,
            label: Object.prototype.hasOwnProperty.call(customColumn, 'label') ? customColumn.label : col.label,
            order: Object.prototype.hasOwnProperty.call(customColumn, 'order') ? customColumn.order : col.order,
            decimals: Object.prototype.hasOwnProperty.call(customColumn, 'decimals') ? customColumn.decimals : col.decimals,
            comment: Object.prototype.hasOwnProperty.call(customColumn, 'comment') ? customColumn.comment : col.comment,
            upperCase: Object.prototype.hasOwnProperty.call(customColumn, 'upperCase') ? customColumn.upperCase : col.upperCase,
            formControlled: Object.prototype.hasOwnProperty.call(customColumn, 'formControlled')
              ? customColumn.formControlled
              : Object.prototype.hasOwnProperty.call(customColumn, 'visible')
                ? customColumn.visible
                : col.visible,
            dropDown: Object.prototype.hasOwnProperty.call(customColumn, 'dropDown') ? customColumn.dropDown : col.dropDown,
            radioGroup: Object.prototype.hasOwnProperty.call(customColumn, 'radioGroup') ? customColumn.radioGroup : col.radioGroup,
            component: Object.prototype.hasOwnProperty.call(customColumn, 'dropDown')
              ? 'Dropdown'
              : Object.prototype.hasOwnProperty.call(customColumn, 'radioGroup')
                ? 'RadioGroup'
                : col.component,
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

      // Valores en blanco para componentes 'Number'
      if (['Date', 'Time', 'DateTime'].includes(col.dataType) && currentValues[col.name] === '') {
        currentValues[col.name] = null;
      } else if (col.dataType === 'Boolean' && (currentValues[col.name] === '' || isDefined(currentValues[col.name]) === false)) {
        currentValues[col.name] = false;
      }

      return col;
    });
    // Ordenar las columnas actualizadas
    updatedColumns.sort((a, b) => (Number(a.order) < Number(b.order) ? -1 : 1));


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
      if (isDefined(column.formControlled) === false) {
        // para columnas no visibles que se contralan
        column.formControlled = true;
      }
      // Cuando es Insert
      if (isUpdate === false && column.name === primaryKey) {
        column.formControlled = false;
        column.visible = false;
        delete values[column.name];
      }
      if (isUpdate === true && column.name === primaryKey) {
        column.formControlled = true;
        column.visible = false;
      }
      // Elimina columnas no visibles y no controladas del currentValues
      if (column.visible === false && column.formControlled === false) {
        delete values[column.name];
      }
      if (column.name === 'uuid') {
        column.formControlled = false;
        column.visible = false;
        delete values[column.name];
      }
    });




    // Actualizar el estado de columns
    setColumns(updatedColumns);
    // console.log(updatedColumns); ok
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
              fieldSchema = zod.union([zod.number(), zod.string().transform(value => value === '' ? null : parseFloat(value))])
                .refine(value => value === null || typeof value === 'number', { message: `${column.label} debe ser un número o estar vacío` });
              if (column.required) {
                fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
              }

              break;
            // case 'Number':
            //   fieldSchema = zod.union([
            //     zod.number(),
            //     zod.string().transform(value => value === '' ? null : parseFloat(value))
            //   ])
            //     .refine(value => value === null || typeof value === 'number', {
            //       message: `${column.label} debe ser un número o estar vacío`,
            //     });

            //   if (column.required) {
            //     fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
            //   }
            //   break;
            case 'String':
              fieldSchema = zod.string();
              if (column.required) {
                fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
              }
              if (column.length) {
                fieldSchema = fieldSchema.max(column.length, { message: `${column.label} debe tener máximo ${column.length} caracteres!` });
              }
              fieldSchema = fieldSchema.transform((value: any) => value === '' ? null : value);
              break;
            case 'Boolean':
              fieldSchema = zod.boolean();
              if (column.required) {
                fieldSchema = fieldSchema.min(1, { message: `${column.label} es obligatorio!` });
              }

              break;
            case 'Date':
              fieldSchema = schemaHelper.date({ message: { required_error: `${column.label} es obligatorio!` } });

              break;
            default:
              fieldSchema = zod.any();
          }
        }
        // Aplicar `.nullable()` para permitir valores nulos
        fieldSchema = fieldSchema.nullable(); // nullable()  nullish .optional()
        schemaObject[column.name] = fieldSchema;
      }
    });
    // console.log(schemaObject);
    const generatedSchema = zod.object(schemaObject);

    setDynamicSchema(schema ? generatedSchema.merge(schema) : generatedSchema);
    reset(values);
  };


  const handleOnSubmit = handleSubmit(async (data) => {

    if (onSubmit) {
      onSubmit(data);
    }
    else {
      try {
        // console.log(data);
        if (await isValidSave(data)) {
          const param = {
            listQuery: saveForm(data)
          }
          await save(param);
          toast.success(!isUpdate ? 'Creado con exito!' : 'Actualizado con exito!');
          if (isUpdate) {
            setCurrentValues(data);
            setIsChangeDetected(false);
            setColumnChange([]);
            mutate();
          }
          reset();
          // regresa
          if (hrefPath) {
            router.push(hrefPath);
          }
        }
        // console.log('DATA', data);
      } catch (error) {
        console.error(error);
      }
    }
  });



  // ******* RENDER COMPONENT
  // eslint-disable-next-line consistent-return
  const renderComponent = (column: Column, index: number) => {
    if (column.visible === true) {
      switch (column.component) {
        case 'Text':
          return <FrmTextField key={index} column={column} />;
        case 'Checkbox':
          return <FrmCheckbox key={index} column={column} />;
        case 'Calendar':
          return <FrmCalendar key={index} column={column} />;
        case 'Dropdown':
          return <FrmDropdown key={index} column={column} />;
        case 'RadioGroup':
          return <FrmRadioGroup key={index} column={column} />;
        default:
          return <FrmTextField key={index} column={column} />;
      }
    }
  }




  const renderOptionsForm = (
    <Tooltip title="Opciones123">
      <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
        <OptionsIcon />
      </IconButton>
    </Tooltip>
  );



  // *******

  return (
    <Form methods={methods} onSubmit={handleOnSubmit}>

      {children || (
        (initialize === false || isLoading === true || processing === true) ? (
          <FormTableSkeleton
            showOptionsForm={showOptionsForm}
            showSubmit={showSubmit}
            numColumns={getVisibleColumns().length || numSkeletonCols}
          />
        ) : (
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card>
                {showOptionsForm && (

                  <CardHeader
                    action={renderOptionsForm}

                  />


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
                    {columns.map((_column: any, index: number) => renderComponent(_column, index))}
                  </Box>
                </CardContent>
                {showSubmit && (
                  <Stack alignItems="flex-end" sx={{ px: 3, mb: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isChangeDetected}>
                      Guardar
                    </LoadingButton>
                  </Stack>
                )}
              </Card>
            </Grid>
          </Grid>
        )
      )}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          paper: { sx: { p: 0, width: 220 } },
          arrow: { placement: 'right-top', offset: 20 }
        }}
      >

        <MenuItem  >
          <RefreshIcon />
          Actualizar
        </MenuItem>

        <MenuItem >
          <DownloadIcon />
          Exportar
        </MenuItem>
        <>

          <Divider sx={{ borderStyle: 'dashed' }} />
          <MenuItem>
            Debug
            <Switch
              checked={debug}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDebug(event.target.checked);
                popover.onClose();
              }
              }
            />
          </MenuItem>

          <MenuItem>
            <ConfigIcon />
            Personalizar
          </MenuItem>
        </>

      </CustomPopover>
      {debug &&
        <DebugForm
          sx={{ display: 'block' }}
          columnChange={columnChange}
          setDebug={setDebug}
          isChangeDetected={isChangeDetected}
          isUpdate={isUpdate}
        />
      }

    </Form>
  );

});
export default FormTable;
