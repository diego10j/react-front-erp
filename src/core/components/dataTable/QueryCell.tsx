import React from 'react';
import { styled } from '@mui/material/styles';
import {
    ColumnDef,
} from '@tanstack/react-table'
import { Checkbox, Avatar } from '@mui/material';





const DatCheckbox = styled(Checkbox)({
    margin: 0,
});


// Create an editable cell renderer
const QueryCell: Partial<ColumnDef<any>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {

        const initialValue: any = getValue();


        // ******* RENDER COMPONENT
        // eslint-disable-next-line consistent-return
        const renderComponent = () => {
            const column: any = table.getColumn(id)?.columnDef;



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