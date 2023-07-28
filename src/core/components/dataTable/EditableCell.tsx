import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    ColumnDef,
} from '@tanstack/react-table'
import { TextField, Checkbox, Autocomplete } from '@mui/material';
import { DateField, TimeField } from '@mui/x-date-pickers';
import { Options } from '../../types';
import { toDate } from '../../../utils/format-time';
import { FORMAT_DATE_FRONT } from '../../../config-global';


const DatTextField = styled(TextField)({
    border: 'none',
    // background: 'transparent',
    outline: 'none',
    // padding: 0,
    width: '100%',
    height: '100%',
    fontSize: 13.3,
});

const DatCalendar = styled(DateField)({
    border: 'none',
    // background: 'transparent',
    outline: 'none',
    // padding: 0,
    width: '100%',
    height: '100%',
    // fontSize: 13,
});

const DatTime = styled(TimeField)({
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


// Create an editable cell renderer
const EditableCell: Partial<ColumnDef<any>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {

        const initialValue: any = getValue();
        // We need to keep and update the state of the cell normally
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(initialValue);

        // When the input is blurred, we'll call our table meta's updateData function
        const updateData = async (newValue: any) => {
            // if (table.options.meta?.updateData(index, id, newValue) === true) {
            const oldValue: any = table.getRowModel().rows[index].original[id];
            if (newValue !== oldValue) {
                await table.options.meta?.updateData(index, id, newValue);
                const column: any = table.options.meta?.eventsColumns.find((_col) => _col.name === id);
                if (column && column.onChange) column.onChange();
            }
            //   }
        }

        // If the initialValue is changed external, sync it up with our state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])




        const getOptionLabel = (option: Options) => {
            const listOptions = table.options.meta?.optionsColumn.get(id) || [];
            if (typeof option === 'string') {
                // Busca el valor en el listado
                if (listOptions.length > 0 && option) {
                    const search: any = listOptions.find((_element: any) => _element.value === option);
                    if (search) return search.label || '';
                }
                return '';
            }
            return option.label || '';
        }

        // ******* RENDER COMPONENT
        // eslint-disable-next-line consistent-return
        const renderComponent = () => {
            const column: any = table.getColumn(id)?.columnDef;

            if (table.options.meta?.readOnly === true || column.disabled === true) return <span>{Number(value) < 0 ? '' : value}</span>

            switch (column.component) {
                case 'Checkbox':
                    return <DatCheckbox
                        checked={value || false}
                        onClick={() => {
                            setValue(!value);
                            updateData(!value);
                        }}
                    />;
                case 'Calendar':
                    return <DatCalendar
                        value={typeof value === 'string' ? toDate(value, FORMAT_DATE_FRONT) : value}
                        onChange={(newValue) => setValue(newValue)}
                        slotProps={{ textField: { size: 'small', variant: 'standard', onBlur: (e: any) => updateData(e.target.value) } }}
                    />;
                case 'Time':
                    return <DatTime
                        format="HH:mm:ss"
                        value={typeof value === 'string' ? toDate(value, FORMAT_DATE_FRONT) : value}
                        onChange={(newValue) => setValue(newValue)}
                        slotProps={{ textField: { size: 'small', variant: 'standard', onBlur: (e: any) => updateData(e.target.value) } }}
                    />;
                case 'CalendarTime':
                    return <DatCalendar
                        format="DD-MM-YYYY HH:mm:ss"
                        value={typeof value === 'string' ? toDate(value, FORMAT_DATE_FRONT) : value}
                        onChange={(newValue) => setValue(newValue)}
                        slotProps={{ textField: { size: 'small', variant: 'standard', onBlur: (e: any) => updateData(e.target.value) } }}
                    />;
                case 'Dropdown':
                    return <Autocomplete
                        size="small"
                        value={value || ''}
                        options={table.options.meta?.optionsColumn.get(id) || []}
                        noOptionsText="Sin opciones"
                        fullWidth
                        getOptionLabel={getOptionLabel}
                        isOptionEqualToValue={(option: any, _value: any) => option.value === _value}
                        onChange={(_event, newValue: any) => {
                            setValue(newValue === null ? '' : newValue?.value || '');
                            updateData(newValue === null ? '' : newValue?.value || '');
                        }
                        }
                        renderInput={(params: any) => (
                            <DatTextField
                                size="small"
                                variant="standard"
                                fullWidth
                                {...params}
                            />
                        )}
                    />
                default:
                    return <DatTextField
                        size="small"
                        variant="standard"
                        disabled={column.disabled}
                        type="column.dataType === 'Number ?number:text"
                        fullWidth
                        value={typeof value === 'number' && value === 0 ? '' : value || ''}
                        onChange={e => setValue(e.target.value)}
                        onBlur={e => updateData(e.target.value)}
                    />;
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