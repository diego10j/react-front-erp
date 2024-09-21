import type {
  ColumnDef,
} from '@tanstack/react-table'

import { styled } from '@mui/material/styles';
import { Link, Stack, Avatar, Checkbox, Typography } from '@mui/material';

import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { fPercent, fCurrency } from '../../../utils/format-number';


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
            alt={column.name}
            src={initialValue}
            variant="square"
            sx={{ width: 60, height: 60, mr: 2 }}
          />;
        case 'Avatar':
          return <Avatar
            alt={column.name}
            src={initialValue}
          />;
        case 'Label':
          return <Label
            color={column.labelComponent.color}
            variant={column.labelComponent.variant}
            sx={column.labelComponent.sx}
            startIcon={column.labelComponent.startIcon}
            endIcon={column.labelComponent.endIcon}
          >
            {initialValue}
          </Label>;
          ;
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

        case 'Money':
          return <
            >
            {fCurrency(initialValue)}
          </>
          case 'Percent':
          return <
            >
            {fPercent(initialValue)}
          </>
        case 'Calendar':
          return <
            >
            {fDate(initialValue)}
          </>
        case 'CalendarTime':
          return <
            >
            {fDateTime(initialValue)}
          </>
        case 'Time':
          return <
            >
            {fTime(initialValue)}
          </>
        case 'Active':
          return <Stack spacing={1} direction="row" >
            <Iconify icon={  initialValue === true ? 'solar:check-circle-bold' : 'solar:minus-circle-bold' }
             sx={{
                  color: initialValue === true ? 'green' : 'red',
                }}  />
            <Typography variant="body2" sx={{ color: initialValue === true ? 'green' : 'red' }} noWrap>
              {initialValue === true ? 'Activo' : 'Inactivo'}
            </Typography>
          </Stack>
        case 'Render':
          return column.renderComponent(initialValue, row.original, column);
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
