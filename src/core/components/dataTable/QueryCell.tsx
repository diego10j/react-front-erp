import React from 'react';
import {
    ColumnDef,
} from '@tanstack/react-table'

import { styled } from '@mui/material/styles';
import { Link, Avatar, Checkbox } from '@mui/material';


const DatCheckbox = styled(Checkbox)({
    margin: 0,
});


// Create an editable cell renderer
const QueryCell: Partial<ColumnDef<any>> = {
    cell: ({ getValue, row, column: { id }, table }) => {

        const initialValue: any = getValue();


        // ******* RENDER COMPONENT
        // eslint-disable-next-line consistent-return
        const renderComponent = () => {
            const column: any = table.getColumn(id)?.columnDef;

            const columnEvent: any = table.options.meta?.eventsColumns.find((_col: any) => _col.name === id);
            if (columnEvent && columnEvent.onClick) column.component = 'Link';

            switch (column.component) {
                case 'Checkbox':
                    return <DatCheckbox
                        checked={initialValue || false}
                        disabled
                    />;
                case 'Image':
                    return <Avatar
                        src={initialValue}
                        variant="square"
                        sx={{ width: 60, height: 60, mr: 2 }}
                    />;
                case 'Link':
                    return <Link
                        component="button"
                        underline="hover"
                        color="inherit"
                        onClick={() => {
                            columnEvent.onClick(row.original);
                        }}
                    >
                        {initialValue}
                    </Link>
                default:
                    return <span>{initialValue}</span>;
            }
        }


        return (
            <>
                {renderComponent()}
            </>
        )
    },
}




export default QueryCell;
