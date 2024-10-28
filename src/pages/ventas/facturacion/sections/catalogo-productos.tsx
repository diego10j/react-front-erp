import { useMemo, useState, useEffect, useCallback } from "react";

import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Table, Button, Dialog, Divider, MenuItem, TableRow, TextField, TableBody, TableCell, TableHead, IconButton, Typography, CardHeader, DialogTitle, Autocomplete, DialogActions, DialogContent, InputAdornment, TableContainer, TablePagination } from "@mui/material";

import { CONFIG } from "src/config-global";
import { getUrlImagen } from 'src/api/sistema/files';
import { useGetCatalogoProductos } from "src/api/inventario/productos";
import { SaveIcon, PrintIcon, DeleteRowIcon } from "src/core/components/icons/CommonIcons";

import { Image } from 'src/components/image';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from "src/components/iconify";
import { EmptyContent } from "src/components/empty-content";

import { IncrementerButton } from "src/sections/product/components/incrementer-button";

import { fCurrency } from '../../../../utils/format-number';

// ----------------------------------------------------------------------

export const FORMAS_DE_PAGO = [
  { value: '1', label: 'Efectivo' },
  { value: '2', label: 'Transferencia' },
  { value: '3', label: 'Deuna' },
  { value: '4', label: 'Tarjeta de Débito' },
  { value: '5', label: 'Tarjeta de Crédito' },
];

export const DEMO_CLIENTES =
  [
    { ide_geper: 1, nom_geper: "DIEGO FERNANDO", correo_geper: "diego10j.89@hotmail.com", identificac_geper: "1719020884" },
    { ide_geper: 2, nom_geper: "CONSUMIDOR FINAL", correo_geper: "consumidor@proerpec.com", identificac_geper: "9999999999" },
    { ide_geper: 3, nom_geper: "JUAN PEREZ", correo_geper: "diego10j.89@hotmail.com", identificac_geper: "1719020884" },
    { ide_geper: 4, nom_geper: "ARLETH JACOME", correo_geper: "arleth@proerpec.com", identificac_geper: "1717194011" },
    { ide_geper: 5, nom_geper: "KEILY JACOME", correo_geper: "keily@proerpec.com", identificac_geper: "1737575769" },

    // Agrega más clientes aquí
  ];

export default function CatalogoProductos() {
  const { dataResponse: productos, isLoading } = useGetCatalogoProductos();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<any[]>([]); // Lista de artículos seleccionados

  // Filtrar productos según el término de búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return productos;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return productos.filter((producto: any) =>
      producto.nombre_inarti.toLowerCase().includes(lowerSearchTerm)
    );
  }, [productos, searchTerm]);

  // Paginación de los productos filtrados
  const paginatedProducts = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page, rowsPerPage]);

  const totalGeneral = useMemo(() => selectedItems.reduce((total, item) => total + item.precio_inarti * item.cantidad, 0), [selectedItems]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [currentFormaPago, setCurrentFormaPago] = useState('1');

  const totalConImpuesto = useMemo(() => totalGeneral * 1.15, [totalGeneral]);


  const [currentMonto, setCurrentMonto] = useState(totalConImpuesto);
  const [pagos, setPagos] = useState<any[]>([]);
  const [montoRestante, setMontoRestante] = useState(totalConImpuesto);

  const [valorRecibido, setValorRecibido] = useState(0);
  const [cambio, setCambio] = useState(0);

  const handleMontoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseFloat(event.target.value) || 0;
    setCurrentMonto(valor > montoRestante ? montoRestante : valor);
  };

  const handleAddPago = () => {
    // Verifica si ya existe un pago con la misma forma de pago
    const existePago = pagos.some(pago => pago.formaPago === FORMAS_DE_PAGO.find(p => p.value === currentFormaPago)?.label);
    if (existePago) {
      toast.error("La forma de pago ya ha sido agregada.");
      return;
    }

    if (currentMonto > 0 && currentMonto <= montoRestante) {
      const nuevoPago = {
        formaPago: FORMAS_DE_PAGO.find((p) => p.value === currentFormaPago)?.label,
        monto: parseFloat(currentMonto.toFixed(2)), // Redondeo a dos decimales
      };

      setPagos([...pagos, nuevoPago]);

      // Actualiza el monto restante y el monto actual redondeando a dos decimales
      const nuevoMontoRestante = parseFloat((montoRestante - currentMonto).toFixed(2));
      setMontoRestante(nuevoMontoRestante);
      setCurrentMonto(nuevoMontoRestante);
      setCurrentFormaPago('');
    }
  };


  const handleChangeFormaPago = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFormaPago(event.target.value);
  }, []);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectItem = (producto: any) => {
    if (!selectedItems.some((item: any) => item.ide_inarti === producto.ide_inarti)) {
      setSelectedItems([...selectedItems, { ...producto, cantidad: 1 }]);
      setPagos([]); // borra pagos registrados
    }
  };

  const handleQuantityChange = (id: number, cantidad: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.ide_inarti === id ? { ...item, cantidad } : item
      )
    );
  };



  const handleIncreaseQuantity = (id: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.ide_inarti === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id: number) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.ide_inarti === id ? { ...item, cantidad: item.cantidad - 1 } : item
      )
    );
  };

  const handleDeleteItem = (id: number) => {
    setSelectedItems((prevItems) => prevItems.filter((item) => item.ide_inarti !== id));
    setPagos([]); // borra pagos registrados
  };


  const handleSelectItemOrder = (id: number) => {
    setSelectedId(id === selectedId ? null : id); // Alterna la selección
  };

  const handleDeletePago = (index: number) => {
    const nuevosPagos = pagos.filter((_, i) => i !== index);
    setPagos(nuevosPagos);
  };

  const handleValorRecibidoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValorRecibido(parseFloat(event.target.value) || 0);
  };


  useEffect(() => {
    const totalPagado = pagos.reduce((acc, pago) => acc + pago.monto, 0);
    const nuevoMontoRestante = parseFloat((totalConImpuesto - totalPagado).toFixed(2));

    // Si el monto restante es cercano a cero (por ejemplo, -0.01 o 0.01), se establece en cero
    setMontoRestante(nuevoMontoRestante >= 0 ? nuevoMontoRestante : 0);
  }, [pagos, totalConImpuesto]);

  useEffect(() => {
    // Calcula el cambio basado en el valor recibido y el monto restante o total de la orden
    let nuevoCambio;

    if (montoRestante === 0) {
      // Si el monto restante es 0, calcula el cambio en base al valor recibido menos el total de la orden
      nuevoCambio = valorRecibido - totalConImpuesto;
    } else {
      // De lo contrario, calcula el cambio en base al valor recibido menos el monto restante
      nuevoCambio = valorRecibido - montoRestante;
    }

    setCambio(nuevoCambio > 0 ? parseFloat(nuevoCambio.toFixed(2)) : 0);
  }, [valorRecibido, montoRestante, totalConImpuesto]);

  // cliente
  const clientes = DEMO_CLIENTES;
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    identificacion: '',
    tipoIdentificacion: '',
    nombres: '',
    correo: '',
    direccion: '',
    telefono: '',
  });
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>({});

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConsumidorFinal = () => {
    setClienteSeleccionado(clientes[1]);
    setNuevoCliente({
      identificacion: clientes[1].identificac_geper,
      tipoIdentificacion: '',
      nombres: clientes[1].nom_geper,
      correo: clientes[1].correo_geper,
      direccion: '',
      telefono: ''
    });
  }
  const handleAddCliente = () => {
    // Lógica para agregar un nuevo cliente
    // Aquí podrías agregar el cliente a un estado o enviarlo a una API
    handleCloseDialog();
  };

  const handleSelectCliente = (value: any) => {
    if (value) {
      setClienteSeleccionado(value);
      setNuevoCliente({
        identificacion: value.identificac_geper,
        tipoIdentificacion: '',
        nombres: value.nom_geper,
        correo: value.correo_geper,
        direccion: '',
        telefono: ''
      });
    }
  };


  const renderTotal = (
    <Grid container spacing={1} sx={{ width: '100%' }}>
      <Grid item xs={6} sx={{ textAlign: 'right', pr: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Subtotal
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle2">{fCurrency(totalGeneral)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'right', pr: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Descuento
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          - {fCurrency(0)}
        </Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'right', pr: 2 }}>
        <Typography variant="body2" color="text.secondary">
          I.V.A 15%
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{fCurrency(totalGeneral * 0.15)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'right', pr: 2 }}>
        <Typography variant="body2" color="text.secondary">
          I.V.A 0%
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Typography variant="body2">{fCurrency(0)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ textAlign: 'right', pr: 2 }}>
        <Typography variant="subtitle1">
          Total
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle1">{fCurrency(totalGeneral + totalGeneral * 0.15)}</Typography>
      </Grid>
    </Grid>


  );

  const renderPayment = (
    <>
      <CardHeader title="Forma de Pago" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ textAlign: 'right' }}>Total: {fCurrency(totalGeneral * 1.15)}</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'right' }}>Monto Restante: {fCurrency(montoRestante)}</Typography>



        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            select
            label="Forma de Pago"
            value={currentFormaPago}
            onChange={handleChangeFormaPago}
            sx={{ maxWidth: 200 }}
          >
            {FORMAS_DE_PAGO.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Monto a Pagar"
            type="number"
            value={currentMonto}
            onChange={handleMontoChange}
            sx={{ maxWidth: 150 }}
          />

          <IconButton
            color="primary"
            onClick={handleAddPago}
            disabled={!currentFormaPago || currentMonto <= 0 || currentMonto > montoRestante}
          >
            <Iconify icon="zondicons:add-solid" />
          </IconButton>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Forma de Pago</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos.map((pago: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{pago.formaPago}</TableCell>
                  <TableCell align="right">{fCurrency(pago.monto)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleDeletePago(index)} color="error">
                      <DeleteRowIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Sección para cálculo de cambio */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{
          mt: 2, borderRadius: 2, p: 1,
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}>
          <TextField
            variant="filled"
            label="Valor Recibido"
            type="number"
            value={valorRecibido}
            onChange={handleValorRecibidoChange}
          />
          <TextField
            variant="filled"
            label="Cambio"
            type="text"
            value={fCurrency(cambio)}
            InputProps={{ readOnly: true }}
          />
        </Stack>

      </Stack>

    </>
  );


  const renderCustomer = (
    <>
      <CardHeader
        title="Cliente"
        action={
          <IconButton onClick={handleOpenDialog}>
            <Iconify icon="fluent:person-add-20-regular" />
          </IconButton>
        }
      />
      <Stack direction="column">

        <Autocomplete
          options={clientes}
          getOptionLabel={(option: any) => option.nom_geper}
          onChange={(event, newValue) => {
            handleSelectCliente(newValue);
          }}

          renderInput={(params) => (
            <TextField {...params} label="Buscar Cliente" variant="outlined" />
          )}
        />

        <Stack spacing={0.5} sx={{ typography: 'body2', pt: 2 }}>
          <div>
            Nombre:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {clienteSeleccionado.nom_geper}
            </Box>
          </div>
          <div>
            Mail:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {clienteSeleccionado.correo_geper}
            </Box>
          </div>
          <div>
            Dirección:
            <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
              {nuevoCliente.direccion || 'Sangolqui'}
            </Box>
          </div>
          <Button
            size="small"
            fullWidth
            onClick={handleConsumidorFinal}
            color="primary"
            startIcon={<Iconify icon="fluent:person-question-mark-16-regular" />}
            sx={{ mt: 1 }}
          >
            Consumidor Final
          </Button>
        </Stack>
      </Stack>

      {/* Diálogo para agregar nuevo cliente */}
      <Dialog open={openDialog} fullWidth maxWidth="xs" onClose={handleCloseDialog} >
        <DialogTitle>Creación Rápida de Cliente</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Identificación"
              value={nuevoCliente.identificacion}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, identificacion: e.target.value })}
              fullWidth
            />
            <TextField
              label="Tipo Identificación"
              select
              value={nuevoCliente.tipoIdentificacion}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, tipoIdentificacion: e.target.value })}
              fullWidth
            >
              <option value="CEDULA">Cédula</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="RUC">RUC</option>
            </TextField>
            <TextField
              label="Nombres"
              value={nuevoCliente.nombres}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombres: e.target.value })}
              fullWidth
            />
            <TextField
              label="Correo Electrónico"
              value={nuevoCliente.correo}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, correo: e.target.value })}
              fullWidth
            />
            <TextField
              label="Dirección"
              value={nuevoCliente.direccion}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
              fullWidth
            />
            <TextField
              label="Teléfono Móvil"
              value={nuevoCliente.telefono}
              onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleAddCliente} color="primary">Agregar Cliente</Button>
        </DialogActions>
      </Dialog>
    </>

  );



  return (
    <Grid container spacing={3} sx={{ flexGrow: 1, height: '90%', maxHeight: '90%' }}>
      <Grid item xs={12} md={5}>
        <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <Box sx={{
            p: 1,
            height: 400,
            borderRadius: 2,
            border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
          }}>
            {selectedItems.length === 0 ? (
              <EmptyContent
                title="Sin Productos!"
                description="Selecciona los productos para agregarlos."
                imgUrl={`${CONFIG.assetsDir}/assets/icons/empty/ic-cart.svg`}
                sx={{ pt: 5, pb: 10 }}
              />
            ) : (
              selectedItems.map((item: any) => (
                <Stack
                  key={item.ide_inarti}
                  direction="row"

                  spacing={2}
                  sx={{
                    backgroundColor: selectedId === item.ide_inarti ? 'background.neutral' : 'transparent', // Cambia el color de fondo si está seleccionado
                    cursor: 'pointer' // Cambia el cursor para indicar que es seleccionable
                  }}
                  onClick={() => handleSelectItemOrder(item.ide_inarti)} // Maneja la selección
                >
                  <Image
                    alt={item.nombre_inarti}
                    src={getUrlImagen(item.foto_inarti)}
                    ratio="1/1"
                    sx={{ width: 48, height: 48, borderRadius: 1 }}
                  />
                  <Stack flexGrow={1}>
                    <Typography variant="caption">{item.nombre_inarti}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IncrementerButton
                        quantity={item.cantidad}
                        onDecrease={() => handleDecreaseQuantity(item.ide_inarti)}
                        onIncrease={() => handleIncreaseQuantity(item.ide_inarti)}
                        disabledDecrease={item.cantidad <= 1}
                        disabledIncrease={item.cantidad >= 3}
                      />
                      <Typography variant="caption"> x {fCurrency(item.precio_inarti || 0)}</Typography>
                      {selectedId === item.ide_inarti && (
                        <IconButton
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic en el icono seleccione el elemento de nuevo
                            handleDeleteItem(item.ide_inarti); // Llama a la función de eliminación
                          }}
                          aria-label="delete-item"
                        >
                          <DeleteRowIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                  <Typography variant="subtitle2">{fCurrency(item.precio_inarti * item.cantidad)}</Typography>

                </Stack>
              ))
            )}




          </Box>

          {renderTotal}
          <Divider sx={{ borderStyle: 'dashed', border: (theme) => `solid 1px ${theme.vars.palette.divider}`, }} />

          {renderCustomer}
          <Divider sx={{ borderStyle: 'dashed', border: (theme) => `solid 1px ${theme.vars.palette.divider}`, }} />
          {renderPayment}

          <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
            <LoadingButton
              variant="outlined"
              startIcon={<SaveIcon />}
              sx={{ pl: 3, flexGrow: 1 }}
            >
              Solo Guardar
            </LoadingButton>
            <LoadingButton
              color="success"
              variant="contained"
              startIcon={<PrintIcon />}
            >
              Imprimir
            </LoadingButton>

          </Stack>

        </Card>

      </Grid>
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            flexGrow: 1,
            height: '90%', maxHeight: '90%',
            borderRadius: 2,
            border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
            overflowY: 'auto',
            p: 2,
          }}
        >
          {isLoading ? null : (
            <>
              <Stack
                spacing={3}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-end', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
              >
                <TextField
                  placeholder="Buscar..."
                  value={searchTerm}
                  size="small"
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: 1, md: 260 } }}
                />
              </Stack>

              <Box
                sx={{ pt: 2 }}
                gap={3}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(6, 1fr)' }}
              >
                {paginatedProducts.map((producto: any) => (
                  <ProductoItem
                    key={producto.ide_inarti}
                    producto={producto}
                    selected={selectedItems.some((item: any) => item.ide_inarti === producto.ide_inarti)}
                    onSelect={() => handleSelectItem(producto)}
                  />
                ))}
              </Box>

              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

// ----------------------------------------------------------------------

type ProductoItemProps = {
  selected: boolean;
  producto: any;
  onSelect: () => void;
};

function ProductoItem({ producto, selected, onSelect }: ProductoItemProps) {
  const { nombre_inarti, precio_inarti, foto_inarti } = producto;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer' }} onClick={onSelect}>
      <Box sx={{ position: 'relative', p: 1 }}>
        <Stack
          sx={{
            top: 10,
            left: 0,
            right: 0,
            zIndex: 9,
            position: 'absolute',
            height: '100%',
            display: 'flex',
            alignItems: 'left',
          }}
        >
          <Label
            sx={{
              fontSize: '0.60rem',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white'
            }}
          >
            {nombre_inarti}
          </Label>
        </Stack>

        <Image
          alt={nombre_inarti}
          src={getUrlImagen(foto_inarti)}
          ratio="1/1"
          sx={{ borderRadius: 1.5 }}

        />

        <Stack
          sx={{
            right: 5,
            bottom: 5,
            zIndex: 9,
            opacity: { xs: 0, md: 1 },
            position: 'absolute',
          }}
        >
          <Label color="primary" variant="filled" sx={{ fontSize: '0.65rem' }}>
            {fCurrency(precio_inarti || 0)}
          </Label>
        </Stack>
      </Box>
    </Card>
  );
}
