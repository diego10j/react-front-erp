import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { Iconify } from 'src/components/iconify';

import { useState } from 'react';
import { fPhoneNumber } from 'src/utils/phone-util';
import { ChatSearchNotFound } from './chat-search-not-found';

// ----------------------------------------------------------------------

type Props = {
    query: string;
    loading?: boolean;
    results: any[];
    title: string;
    onSearch: (inputValue: string) => void;
    onClear: () => void;
    onSelectContact: (contact: any) => void;
};

export function ChatSearch({ query, results, onSearch, onClear, onSelectContact, loading, title }: Props) {

    const [isOpen, setIsOpen] = useState(false); // Estado para controlar la visibilidad del menú

    const handleClick = (contact: any) => {
        onSelectContact(contact);
        onClear();
        setIsOpen(false); // Cierra el menú después de seleccionar una opción
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (query) {
            if (event.key === 'Enter') {
                const selectItem = results.filter(
                    (contact) =>
                        contact.nombre_whcha.toLowerCase().includes(query.toLowerCase()) ||
                        fPhoneNumber(contact.wa_id_whmem).toLowerCase().includes(query.toLowerCase())
                )[0];

                if (selectItem) {
                    handleClick(selectItem);
                }
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
            getOptionLabel={(option) => `${option.nombre_whcha} - ${fPhoneNumber(option.wa_id_whmem)}`} // Busca en ambos campos
            noOptionsText={<ChatSearchNotFound query={query} />}
            isOptionEqualToValue={(option, value) => option.ide_whcha === value.ide_whcha}
            open={isOpen} // Controla si el menú está abierto o cerrado
            onOpen={() => setIsOpen(true)} // Abre el menú al hacer clic
            onClose={() => setIsOpen(false)} // Cierra el menú al hacer clic fuera o seleccionar una opción
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
                // Resaltado para nombre_whcha
                const matchesNombre = match(contact.nombre_whcha, inputValue);
                const partsNombre = parse(contact.nombre_whcha, matchesNombre);

                // Resaltado para wa_id_whmem
                const matchesWaId = match(fPhoneNumber(contact.wa_id_whmem), inputValue);
                const partsWaId = parse(fPhoneNumber(contact.wa_id_whmem), matchesWaId);

                return (
                    <Box component="li" {...props} onClick={() => handleClick(contact)} key={contact.ide_whcha}>
                        <Avatar
                            key={contact.ide_whcha}
                            alt={contact?.nombre_whcha}
                            sx={{ mr: 1.5, width: 32, height: 32, flexShrink: 0 }}
                        />

                        <div key={inputValue}>
                            {/* Mostrar nombre_whcha resaltado */}
                            <Typography
                                component="span"
                                sx={{
                                    typography: 'body2',
                                    fontWeight: 'fontWeightMedium',
                                }}
                            >
                                {partsNombre.map((part, index) => (
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
                            </Typography>

                            {/* Mostrar wa_id_whmem resaltado */}
                            <Typography
                                component="span"
                                sx={{
                                    typography: 'body2',
                                    fontWeight: 'fontWeightMedium',
                                    ml: 1, // Margen izquierdo para separar los campos
                                }}
                            >
                                {partsWaId.map((part, index) => (
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
                            </Typography>
                        </div>
                    </Box>
                );
            }}
        />
    );
}