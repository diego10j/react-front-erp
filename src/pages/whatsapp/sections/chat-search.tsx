import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
    query: string;
    loading?: boolean;
    results: any[];
    title: string;
    onSearch: (inputValue: string) => void;
    onSelectContact: (contact: any) => void;
};

export function ChatSearch({ query, results, onSearch, onSelectContact, loading, title }: Props) {


    const handleClick = (contact: any) => {
        onSelectContact(contact)
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (query) {
            if (event.key === 'Enter') {
                const selectItem = results.filter((contact) => contact.nombre_whcha === query)[0];

                handleClick(selectItem.ide_whcha);
            }
        }
    };

    return (
        <Autocomplete
            sx={{ width: { xs: 1, sm: 260 } }}
            loading={loading}
            autoHighlight
            size="small"
            popupIcon={null}
            options={results}
            onInputChange={(event, newValue) => onSearch(newValue)}
            getOptionLabel={(option) => option.name_whcha}
            noOptionsText={<SearchNotFound query={query} />}
            isOptionEqualToValue={(option, value) => option.ide_whcha === value.ide_whcha}
            slotProps={{
                popper: { placement: 'bottom-start', sx: { minWidth: 320 } },
                paper: { sx: { [` .${autocompleteClasses.option}`]: { pl: 0.75 } } },
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={title}
                    onKeyUp={handleKeyUp}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {loading ? <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, contact, { inputValue }) => {
                const matches = match(`${contact.nombre_whcha}-${contact.wa_id_whmem}`, inputValue);
                const parts = parse(`${contact.nombre_whcha}-${contact.wa_id_whmem}`, matches);

                return (
                    <Box component="li" {...props} onClick={() => handleClick(contact)} key={contact.ide_whcha}>
                        <Avatar
                            key={contact.ide_whcha}
                            alt={contact?.nombre_whcha}
                            sx={{ mr: 1.5, width: 32, height: 32, flexShrink: 0 }}
                        />

                        <div key={inputValue}>
                            {parts.map((part, index) => (
                                <Typography
                                    key={index}
                                    component="span"
                                    color={part.highlight ? 'primary' : 'textPrimary'}
                                    sx={{
                                        typography: 'body2',
                                        fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                                    }}
                                >
                                    {part.text}
                                </Typography>
                            ))}
                        </div>
                    </Box>
                );
            }}
        />
    );
}
