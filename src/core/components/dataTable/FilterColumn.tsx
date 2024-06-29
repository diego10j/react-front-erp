import type {
  Table,
  Column,
} from '@tanstack/react-table'

import { useMemo, useState, useEffect } from 'react';

import { TextField, IconButton, InputAdornment } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export type FilterColumnProps = {
  column: Column<any, unknown>
  table: Table<any>
};


export default function FilterColumn({
  column,
  table,
}: FilterColumnProps) {

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column, firstValue]
  )
  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
            }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
            }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={`${column.id}list`}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={`${column.id}list`}
      />
      <div className="h-1" />
    </>
  )


}


// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleClear = () => {
    setValue('');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <TextField inputProps={props} InputProps={{
      sx: {
        fontSize: '0.7rem',
        width: '100%',
        height: 25,
        '& input': { p: 0, textAlign: 'left' },
      },
      endAdornment: <InputAdornment position="end">

        <IconButton onClick={handleClear}>

          {value === '' ? (
            <Iconify icon="solar:share-bold FilterListIcon" sx={{ fontSize: 15 }} />
          ) : (
            <Iconify icon="solar:share-bold FilterListOffIcon" sx={{ fontSize: 15 }} />
          )}
        </IconButton>

      </InputAdornment>,
    }}
      size='small'
      variant='standard'
      fullWidth
      value={value}
      onChange={e => setValue(e.target.value)}

    />
  )
}


// export default function FilterColumn({
//     column,
//     table,
// }: FilterColumnProps) {
//     const firstValue = table
//         .getPreFilteredRowModel()
//         .flatRows[0]?.getValue(column.id)
//
//     const columnFilterValue = column.getFilterValue()
//
//     return typeof firstValue === 'number' ? (
//         <div className="flex space-x-2">
//             <InputBase
//                 type="number"
//                 value={(columnFilterValue as [number, number])?.[0] ?? ''}
//                 onChange={e =>
//                     column.setFilterValue((old: [number, number]) => [
//                         e.target.value,
//                         old?.[1],
//                     ])
//                 }
//                 placeholder="Min"
//                 className="w-24 border shadow rounded"
//             />
//             <InputBase
//                 type="number"
//                 value={(columnFilterValue as [number, number])?.[1] ?? ''}
//                 onChange={e =>
//                     column.setFilterValue((old: [number, number]) => [
//                         old?.[0],
//                         e.target.value,
//                     ])
//                 }
//                 placeholder="Max"
//                 className="w-24 border shadow rounded"
//                 inputProps={{ 'aria-label': 'search' }}
//             />
//         </div>
//     ) : (
//         <InputBase
//             size='small'
//             value={(columnFilterValue ?? '') as string}
//             onChange={e => column.setFilterValue(e.target.value)}
//             placeholder="Search..."
//             inputProps={{ 'aria-label': 'search' }}
//         />
//     )
// }
