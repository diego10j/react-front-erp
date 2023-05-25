import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    ColumnDef,
} from '@tanstack/react-table'
import { TextField, Switch } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { toDate } from '../../../utils/formatTime';
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

const DatSwitch = styled(Switch)({
    margin: 0,
});


// Create an editable cell renderer
const EditableCell: Partial<ColumnDef<any>> = {
    cell: ({ getValue, row: { index }, column: { id, columnDef }, table }) => {

        const initialValue: any = getValue();
        // We need to keep and update the state of the cell normally
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(initialValue);

        // When the input is blurred, we'll call our table meta's updateData function
        const updateData = (newValue: any) => {
            table.options.meta?.updateData(index, id, newValue)
        }


        // If the initialValue is changed external, sync it up with our state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])


        // ******* RENDER COMPONENT
        // eslint-disable-next-line consistent-return
        const renderComponent = () => {
            const column: any = columnDef;
            console.log(column);
            switch (column.component) {
                case 'Checkbox':
                    return <DatSwitch
                        checked={value || false}
                        onClick={() => {
                            setValue(!value);
                            updateData(!value);
                        }}
                    />;
                case 'Calendar':
                    return <DatCalendar
                        value={typeof value === 'string' ? toDate(value, FORMAT_DATE_FRONT) : value}
                        onChange={(newValue) => {
                            console.log(newValue);
                            // setValue(newValue);
                            // updateData(!newValue);
                        }}
                        slotProps={{ textField: { size: 'small', variant: 'standard' } }}
                    />;
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