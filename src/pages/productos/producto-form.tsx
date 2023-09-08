import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// types
import { IProduct } from 'src/types/product';
// utils
import { fData } from 'src/utils/format-number';
// _mock
import {
    _tags,
    PRODUCT_SIZE_OPTIONS,
    PRODUCT_GENDER_OPTIONS,
    PRODUCT_COLOR_NAME_OPTIONS,
    PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';
// components
import { CustomFile } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';
import { useRouter } from 'src/routes/hook';
import FormProvider, {
    RHFSelect,
    RHFEditor,
    RHFUpload,
    RHFSwitch,
    RHFTextField,
    RHFMultiSelect,
    RHFAutocomplete,
    RHFMultiCheckbox,
    RHFUploadAvatar
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

// interface FormValuesProps extends Omit<IProduct, 'images'> {
//    images: (CustomFile | string)[];
// }


interface FormValuesProps extends Omit<IProduct, 'coverUrl'> {
    coverUrl: CustomFile | string | null;
}


type Props = {
    currentProduct?: any;
};

export default function ProductoForm({ currentProduct }: Props) {
    const router = useRouter();

    const mdUp = useResponsive('up', 'md');

    const { enqueueSnackbar } = useSnackbar();

    const [includeTaxes, setIncludeTaxes] = useState(false);

    const NewProductSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        // images: Yup.array().min(1, 'Images is required'),
        coverUrl: Yup.mixed().required('Cover is required'),
        tags: Yup.array().min(2, 'Must have at least 2 tags'),
        category: Yup.string().required('Category is required'),
        price: Yup.number().moreThan(0, 'Price should not be $0.00'),
        description: Yup.string().required('Description is required'),

        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
        phoneNumber: Yup.string().required('Phone number is required'),
        address: Yup.string().required('Address is required'),
        country: Yup.string().required('Country is required'),
        company: Yup.string().required('Company is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        role: Yup.string().required('Role is required'),
        avatarUrl: Yup.mixed().required('Avatar is required'),
    });

    const defaultValues = useMemo(
        () => ({
            name: currentProduct?.name || '',
            description: currentProduct?.description || '',
            subDescription: currentProduct?.subDescription || '',
            // images: currentProduct?.images || [],
            coverUrl: currentProduct?.coverUrl || null,
            //
            code: currentProduct?.code || '',
            sku: currentProduct?.sku || '',
            price: currentProduct?.price || 0,
            quantity: currentProduct?.quantity || 0,
            priceSale: currentProduct?.priceSale || 0,
            tags: currentProduct?.tags || [],
            taxes: currentProduct?.taxes || 0,
            gender: currentProduct?.gender || '',
            category: currentProduct?.category || '',
            colors: currentProduct?.colors || [],
            sizes: currentProduct?.sizes || [],
            newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
            saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },


            email: currentProduct?.email || '',
            phoneNumber: currentProduct?.phoneNumber || '',
            address: currentProduct?.address || '',
            country: currentProduct?.country || '',
            state: currentProduct?.state || '',
            city: currentProduct?.city || '',
            zipCode: currentProduct?.zipCode || '',
            avatarUrl: currentProduct?.avatarUrl || null,
            isVerified: currentProduct?.isVerified || true,
            status: currentProduct?.status,
            company: currentProduct?.company || '',
            role: currentProduct?.role || '',


        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentProduct]
    );

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewProductSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (currentProduct) {
            reset(defaultValues);
        }
    }, [currentProduct, defaultValues, reset]);

    useEffect(() => {
        if (includeTaxes) {
            setValue('taxes', 0);
        } else {
            setValue('taxes', currentProduct?.taxes || 0);
        }
    }, [currentProduct?.taxes, includeTaxes, setValue]);

    const onSubmit = useCallback(
        async (data: FormValuesProps) => {
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));
                reset();
                enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
                router.push(paths.dashboard.product.root);
                console.info('DATA', data);
            } catch (error) {
                console.error(error);
            }
        },
        [currentProduct, enqueueSnackbar, reset, router]
    );

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('coverUrl', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleRemoveFile = useCallback(() => {
        setValue('coverUrl', null);
    }, [setValue]);


    const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setIncludeTaxes(event.target.checked);
    }, []);

    const renderDetails = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Detalles
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Título, breve descripción, imagen...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Details" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField name="name" label="Nombre del Producto" />

                        <RHFTextField name="subDescription" label="Descripción" multiline rows={4} />

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Contenido</Typography>
                            <RHFEditor simple name="description" placeholder="Escribe información acerca del producto..." />
                        </Stack>

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">Imagen</Typography>
                            <RHFUpload
                                name="coverUrl"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                onDelete={handleRemoveFile}
                            />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>

            <Grid container spacing={3}>
                <Grid xs={12} md={4}>
                    <Card sx={{ pt: 10, pb: 5, px: 3 }}>



                        <Box sx={{ mb: 5 }}>
                            <RHFUploadAvatar
                                name="avatarUrl"
                                maxSize={3145728}
                                onDrop={handleDrop}
                                helperText={
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            mt: 3,
                                            mx: 'auto',
                                            display: 'block',
                                            textAlign: 'center',
                                            color: 'text.disabled',
                                        }}
                                    >
                                        Allowed *.jpeg, *.jpg, *.png, *.gif
                                        <br /> max size of {fData(3145728)}
                                    </Typography>
                                }
                            />
                        </Box>


                        <RHFSwitch
                            name="isVerified"
                            labelPlacement="start"
                            label={
                                <>
                                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                                        Email Verified
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Disabling this will automatically send the user a verification email
                                    </Typography>
                                </>
                            }
                            sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                        />

                        {currentProduct && (
                            <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                                <Button variant="soft" color="error">
                                    Delete User
                                </Button>
                            </Stack>
                        )}
                    </Card>
                </Grid>

                <Grid xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="name" label="Full Name" />
                            <RHFTextField name="email" label="Email Address" />
                            <RHFTextField name="phoneNumber" label="Phone Number" />
                            <RHFTextField name="city" label="City" />
                            <RHFTextField name="address" label="Address" />
                            <RHFTextField name="zipCode" label="Zip/Code" />
                            <RHFTextField name="company" label="Company" />
                            <RHFTextField name="role" label="Role" />
                        </Box>

                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Guardar
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>

        </>
    );

    const renderProperties = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Propiedades
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Funciones y atributos adicionales...
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Properties" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <Box
                            columnGap={2}
                            rowGap={3}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                md: 'repeat(2, 1fr)',
                            }}
                        >
                            <RHFTextField name="code" label="Código del Producto" />

                            <RHFTextField name="sku" label="Product SKU" />

                            <RHFTextField
                                name="quantity"
                                label="Quantity"
                                placeholder="0"
                                type="number"
                                InputLabelProps={{ shrink: true }}
                            />

                            <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                                    <optgroup key={category.group} label={category.group}>
                                        {category.classify.map((classify) => (
                                            <option key={classify} value={classify}>
                                                {classify}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </RHFSelect>

                            <RHFMultiSelect
                                checkbox
                                name="colors"
                                label="Colors"
                                options={PRODUCT_COLOR_NAME_OPTIONS}
                            />

                            <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} />
                        </Box>

                        <RHFAutocomplete
                            name="tags"
                            label="Tags"
                            placeholder="+ Tags"
                            multiple
                            freeSolo
                            options={_tags.map((option) => option)}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option) => (
                                <li {...props} key={option}>
                                    {option}
                                </li>
                            )}
                            renderTags={(selected, getTagProps) =>
                                selected.map((option, index) => (
                                    <Chip
                                        {...getTagProps({ index })}
                                        key={option}
                                        label={option}
                                        size="small"
                                        color="info"
                                        variant="soft"
                                    />
                                ))
                            }
                        />

                        <Stack spacing={1}>
                            <Typography variant="subtitle2">Gender</Typography>
                            <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
                        </Stack>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Stack direction="row" alignItems="center" spacing={3}>
                            <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
                            <RHFTextField
                                name="saleLabel.content"
                                label="Sale Label"
                                fullWidth
                                disabled={!values.saleLabel.enabled}
                            />
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={3}>
                            <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
                            <RHFTextField
                                name="newLabel.content"
                                label="New Label"
                                fullWidth
                                disabled={!values.newLabel.enabled}
                            />
                        </Stack>
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderPricing = (
        <>
            {mdUp && (
                <Grid md={4}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        Pricing
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Price related inputs
                    </Typography>
                </Grid>
            )}

            <Grid xs={12} md={8}>
                <Card>
                    {!mdUp && <CardHeader title="Pricing" />}

                    <Stack spacing={3} sx={{ p: 3 }}>
                        <RHFTextField
                            name="price"
                            label="Regular Price"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box component="span" sx={{ color: 'text.disabled' }}>
                                            $
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <RHFTextField
                            name="priceSale"
                            label="Sale Price"
                            placeholder="0.00"
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box component="span" sx={{ color: 'text.disabled' }}>
                                            $
                                        </Box>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControlLabel
                            control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
                            label="Price includes taxes"
                        />

                        {!includeTaxes && (
                            <RHFTextField
                                name="taxes"
                                label="Tax (%)"
                                placeholder="0.00"
                                type="number"
                                InputLabelProps={{ shrink: true }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                                %
                                            </Box>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    </Stack>
                </Card>
            </Grid>
        </>
    );

    const renderActions = (
        <>
            {mdUp && <Grid md={4} />}
            <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Publish"
                    sx={{ flexGrow: 1, pl: 3 }}
                />

                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                    {!currentProduct ? 'Create Product' : 'Save Changes'}
                </LoadingButton>
            </Grid>
        </>
    );

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                {renderDetails}

                {renderProperties}

                {renderPricing}

                {renderActions}
            </Grid>
        </FormProvider>
    );
}
