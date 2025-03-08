import type { SelectChangeEvent } from '@mui/material';
import type {
  ColumnDef,
} from '@tanstack/react-table'
import type { IDatePickerControl } from 'src/types/common';

import dayjs from 'dayjs';
import { SketchPicker } from 'react-color';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Select , Divider, Checkbox, MenuItem, TextField, FormControl, InputAdornment } from '@mui/material';

import { fBoolean } from 'src/utils/common-util';
import { fCurrency } from 'src/utils/format-number';

import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { Iconify } from '../../../components/iconify/iconify';
import { fDate, fTime, fDateTime } from '../../../utils/format-time';

const DatLabelTable = styled('p')({
  maxHeight: '30px',
  height: '30px',
  overflow: 'hidden',
  maxWidth: '98%',
  whiteSpace: 'nowrap',
  margin: '0',
  textOverflow: 'ellipsis'
});

const DatLabel = styled('span')({
  width: '100%',
});

const DatTextField = styled(TextField)({
  border: 'none',
  // background: 'transparent',
  outline: 'none',
  // padding: 0,
  width: '100%',
  height: '100%',
  //  fontSize: 13.3,
});

const DatCalendar = styled(DatePicker)({
  border: 'none',
  // background: 'transparent',
  outline: 'none',
  // padding: 0,
  width: '100%',
  height: '100%',
  // fontSize: 13,
});

const DatCalendarTime = styled(DateTimePicker)({
  border: 'none',
  // background: 'transparent',
  outline: 'none',
  // padding: 0,
  width: '100%',
  height: '100%',
  // fontSize: 13,
});

const DatTime = styled(TimePicker)({
  border: 'none',
  // background: 'transparent',
  outline: 'none',
  // padding: 0,
  width: '100%',
  height: '100%',
  // fontSize: 13,
});

const DatCheckbox = styled(Checkbox)({
  margin: 0,
});


// Estilos usando styled de @mui/material
const ColorSwatch = styled('div')({
  padding: '2px',
  bgcolor: 'background.neutral',
  borderRadius: 1.5,
  display: 'inline-block',
  cursor: 'pointer',

});

// Define the type for the formatter functions
type FormatterFunction = (value: any) => string | number | null;


// Create an editable cell renderer
const EditableCell: Partial<ColumnDef<any>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const popover = usePopover();

    const initialValue: any = getValue();
    // We need to keep and update the state of the cell normally
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(initialValue);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const inputRef = useRef<HTMLInputElement>(null);

    // eslint-disable-next-line arrow-body-style, react-hooks/rules-of-hooks
    const isEditing: boolean = useMemo(() => {
      return table.options.meta?.readOnly === false && table.options.meta?.editingCell?.rowIndex === index && table.options.meta?.editingCell?.columnId === id;
    }, [table.options.meta, index, id]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const options = useMemo(() => table.options.meta?.optionsColumn?.get(id) || [], [table.options.meta, id]);

    // When the input is blurred, we'll call our table meta's updateData function
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks
    const updateData = useCallback((newValue: any) => {
      if (isEditing) {
        const oldValue = table.getRowModel().rows[index].original[id];
        if (newValue !== oldValue) {
          const column: any = table.options.meta?.eventsColumns.find((_col: any) => _col.name === id);
          table.options.meta?.removeErrorCells(index, id);

          table.options.meta?.updateData(index, id, newValue);
          if (column && column.onChange) column.onChange();
        }
      }
    }, [isEditing, table, index, id]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);


    // eslint-disable-next-line react-hooks/rules-of-hooks

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      const columns: any[] = table.getAllColumns().filter(col => col.getIsVisible());
      const currentCol: any = columns.find(col => col.id === id);
      const indexCol = columns.indexOf(currentCol);
      let newIndex = indexCol;

      switch (event.key) {
        case 'Tab':
          newIndex = (indexCol + 1) % columns.length;
          table.options.meta?.handleEditCell(index, columns[newIndex].id);
          event.preventDefault(); // Prevent default tab behavior
          break;
        // case 'ArrowLeft':
        //   newIndex = (indexCol - 1 + columns.length) % columns.length;
        //   table.options.meta?.handleEditCell(index, columns[newIndex].id);
        //   break;
        // case 'ArrowRight':
        //   newIndex = (indexCol + 1) % columns.length;
        //   table.options.meta?.handleEditCell(index, columns[newIndex].id);
        //   break;
        // case 'ArrowUp':
        //   if (index > 0) {
        //     table.options.meta?.handleEditCell(index - 1, id);
        //   }
        //   break;
        // case 'ArrowDown':
        //   if (index < table.getRowModel().rows.length - 1) {
        //     table.options.meta?.handleEditCell(index + 1, id);
        //   }
        //   break;
        default:
          break;
      }
    };


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleSelectChange = useCallback(
      (event: SelectChangeEvent) => {
        const newValue = event.target.value;
        setValue(newValue);
        updateData(newValue);
      },
      [updateData]
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        updateData(newValue);
      },
      [updateData]
    );


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleChangeDate = useCallback(
      (newValue: IDatePickerControl) => {
        setValue(newValue);
        updateData(newValue);
      },
      [updateData]
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleChangeColor = useCallback(
      (color: any) => {
        const rgbValue = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
        setValue(rgbValue);
        updateData(rgbValue);
      },
      [updateData]
    );


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fLabelOption = useCallback((optionValue: number) => {
      // Busca el valor en el listado
      if (options.length > 0) {
        const search = options.find((element: any) => element.value === optionValue);
        if (search) return search.label || '';
      }
      return '';
    }, [options]);


    const renderLabel = (val: any, formatter: FormatterFunction) => {
      if (table.options.meta?.readOnly === false) {
        return <DatLabelTable>{formatter(val)}</DatLabelTable>
      }
      return <DatLabel>{formatter(val)}</DatLabel>
    }


    // ******* RENDER COMPONENT
    // eslint-disable-next-line consistent-return
    const renderComponent = () => {
      const column: any = table.getColumn(id)?.columnDef;


      if (isEditing === true && column.disabled === false) {
        switch (column.component) {
          case 'Checkbox':
            return <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}><DatCheckbox
                checked={value || false}
                onClick={() => {
                  setValue(!value);
                  updateData(!value);
                }}
              />
            </div>
          case 'Calendar':
            return <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}>
              <DatCalendar
                autoFocus
                value={dayjs(value)}
                onChange={handleChangeDate}
                slotProps={{ textField: { size: 'small', variant: 'standard' } }}
              />
            </div>;
          case 'Time':
            return <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}>
              <DatTime
                autoFocus
                views={['hours', 'minutes', 'seconds']}
                value={dayjs(value)}
                onChange={handleChangeDate}
                slotProps={{ textField: { size: 'small', variant: 'standard' } }}
              />
            </div>;
          case 'CalendarTime':
            return <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}>
              <DatCalendarTime
                autoFocus
                value={dayjs(value)}
                onChange={handleChangeDate}
                slotProps={{ textField: { size: 'small', variant: 'standard' } }}
              />
            </div>;
          case 'Dropdown':
            return <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}>
              <FormControl
                variant="standard"
                size="small"
                fullWidth
                disabled={column.disabled}>

                <Select
                  autoFocus
                  fullWidth
                  value={value}
                  onChange={handleSelectChange}

                >
                  <MenuItem value=""> <em>(Null)</em></MenuItem>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {options.length > 0 ? (
                    options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No options available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </div>;
          case 'Color':
            return (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}>

                <ColorSwatch onClick={popover.onOpen}>
                  <div
                    style={{
                      width: '40px',
                      height: '20px',
                      borderRadius: 2,
                      backgroundColor: value || 'transparent',
                    }}
                  />
                </ColorSwatch>
                <CustomPopover
                  open={popover.open}
                  anchorEl={popover.anchorEl}
                  onClose={popover.onClose}
                  slotProps={{
                    paper: { sx: { p: 0, width: 220 } },
                    arrow: { placement: 'right-top', offset: 20 }
                  }}
                >
                  <SketchPicker color={value || '#333'} onChange={handleChangeColor} />
                </CustomPopover>
              </div>
            );
          case 'Icon':
            return (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={handleKeyDown}
              >
                <DatTextField
                  autoFocus
                  size="small"
                  variant="standard"
                  disabled={column.disabled}
                  type="text"
                  inputRef={inputRef}
                  inputProps={{ style: { textAlign: 'left' } }}
                  fullWidth
                  value={value || ''}
                  onChange={handleChange}
                  onDoubleClick={(e: any) => {
                    e.target.select();
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {value && (
                          <Iconify icon={value} sx={{ color: 'text.disabled' }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            );
          default:
            return <div
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown}>
              <DatTextField
                autoFocus
                size="small"
                variant="standard"
                disabled={column.disabled}
                type={column.dataType === 'Number' ? 'number' : 'text'}
                inputRef={inputRef}
                inputProps={{ style: { textAlign: column.align } }}
                fullWidth
                value={typeof value === 'number' && value === 0 ? '' : value || ''}
                onChange={handleChange}
                onDoubleClick={(e: any) => {
                  e.target.select();
                }}
              />
            </div>
        }
      }
      else {
        switch (column.component) {
          case 'Checkbox':
            return renderLabel(value, fBoolean);
          case 'Money':
            return renderLabel(value, fCurrency);
          case 'Dropdown':
            return renderLabel(value, fLabelOption);
          case 'Calendar':
            return renderLabel(value, fDate);
          case 'CalendarTime':
            return renderLabel(value, fDateTime);
          case 'Time':
            return renderLabel(value, fTime);
          case 'Color':
            return (
              <ColorSwatch>
                <div
                  style={{
                    width: '40px',
                    height: '20px',
                    borderRadius: 2,
                    backgroundColor: value || 'transparent',
                  }}
                />
              </ColorSwatch>
            );
          case 'Icon':
            return (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <DatLabelTable>{value}</DatLabelTable>
                {value && (
                  <Iconify icon={value} sx={{ color: 'text.disabled', marginLeft: 1 }} />
                )}
              </div>
            );
          default:
            if (table.options.meta?.readOnly === false) {
              return <DatLabelTable>{value}</DatLabelTable>
            }
            return <DatLabel>{value}</DatLabel>
        }
      }
    }

    return (
      <>
        {renderComponent()}
      </>
    )
  },
}




export default EditableCell;
