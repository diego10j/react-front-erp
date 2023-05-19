import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    ColumnDef,
} from '@tanstack/react-table'
import { InputBase } from '@mui/material';

const DatTextField = styled('input')(({ theme }) => ({
    border: 'none',
    background: 'transparent',
    outline: 'none',
    padding: 0,
    marggin: 0,
    width: '100%',
    height: '100%',
}));


// Create an editable cell renderer
// Give our default column cell renderer editing superpowers!
const EditableCell: Partial<ColumnDef<any>> = {
    cell: ({ getValue, row: { index }, column: { id, columnDef }, table }) => {
        // const col: any = columnDef;
        // console.log(col.name);
        const initialValue = getValue() || '';
        // We need to keep and update the state of the cell normally
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(initialValue);

        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
            table.options.meta?.updateData(index, id, value)
        }


        // If the initialValue is changed external, sync it up with our state
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])

        return (
            <InputBase
                size="small"
                fullWidth
                value={value as string}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
                sx={{
                    height: '100%',
                    background: 'transparent',
                    fontSize: 13,
                }}
            />
        )
    },
}

export default EditableCell;