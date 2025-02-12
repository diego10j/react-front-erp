// import React, { useState, useEffect } from 'react';
// import { TextField, Autocomplete, CircularProgress, Button, Dialog, DialogTitle } from '@mui/material';
// import axios from 'axios';

// const DynamicSelect = ({ onNewOption }) => {
//   const [open, setOpen] = useState(false);
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [inputValue, setInputValue] = useState('');

//   useEffect(() => {
//     if (!open) return;
//     setLoading(true);
//     axios.get('/api/titles')  // Cambia a la ruta de tu API
//       .then((response) => {
//         setOptions(response.data);
//         setLoading(false);
//       });
//   }, [open]);

//   const handleCreateOption = (newValue) => {
//     axios.post('/api/titles', { nombre_getit: newValue })  // Cambia a la ruta de tu API
//       .then((response) => {
//         const newOption = response.data;
//         setOptions((prev) => [...prev, newOption]);
//         if (onNewOption) onNewOption(newOption);
//       });
//   };

//   return (
//     <>
//       <Autocomplete
//         open={open}
//         onOpen={() => setOpen(true)}
//         onClose={() => setOpen(false)}
//         isOptionEqualToValue={(option, value) => option.nombre_getit === value}
//         getOptionLabel={(option) => option.nombre_getit}
//         options={options}
//         loading={loading}
//         freeSolo
//         inputValue={inputValue}
//         onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
//         onChange={(event, newValue) => {
//           if (typeof newValue === 'string') {
//             handleCreateOption(newValue);
//           } else if (newValue && newValue.inputValue) {
//             handleCreateOption(newValue.inputValue);
//           }
//         }}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Seleccione o escriba..."
//             variant="outlined"
//             InputProps={{
//               ...params.InputProps,
//               endAdornment: (
//                 <>
//                   {loading ? <CircularProgress color="inherit" size={20} /> : null}
//                   {params.InputProps.endAdornment}
//                 </>
//               ),
//             }}
//           />
//         )}
//       />
//       <Button onClick={() => setOpenDialog(true)}>Buscar más...</Button>
//     </>
//   );
// };
