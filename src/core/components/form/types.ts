import { TableQuery } from '../../types';
import { CustomColumn } from '../dataTable/types';


export type UseFormTableProps = {
    config: TableQuery;
    customColumns?: Array<CustomColumn>;
};