import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { AnimateLogo2 } from 'src/components/animate';
import { Form, Field } from 'src/components/hook-form';

import { FormHead } from '../../../components/form-head';
import { FormSocials } from '../../../components/form-socials';
import { FormDivider } from '../../../components/form-divider';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const password = useBoolean();

  const defaultValues = { email: '', password: '' };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderLogo = <AnimateLogo2 sx={{ mb: 3, mx: 'auto' }} />;

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Box gap={1.5} display="flex" flexDirection="column">
        <Link
          component={RouterLink}
          href={paths.authDemo.centered.resetPassword}
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          Forgot password?
        </Link>

        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sign in..."
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  return (
    <>
      {renderLogo}

      <FormHead
        title="Sign in to your account"
        description={
          <>
            {`Don’t have an account? `}
            <Link component={RouterLink} href={paths.authDemo.centered.signUp} variant="subtitle2">
              Get started
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <FormDivider />

      <FormSocials
        signInWithGoogle={() => {}}
        singInWithGithub={() => {}}
        signInWithTwitter={() => {}}
      />
    </>
  );
}
