import type { IUserProfile, IUserProfilePost } from 'src/types/user';

import { useRef } from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';

import { ProfilePostItem } from './profile-post-item';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile;
  posts: IUserProfilePost[];
};

export function ProfileHome({ info, posts }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {fNumber(info.totalFollowers)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Follower
          </Box>
        </Stack>

        <Stack width={1}>
          {fNumber(info.totalFollowing)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3, typography: 'body2' }}>
        <Box>{info.quote}</Box>

        <Box display="flex">
          <Iconify width={24} icon="mingcute:location-fill" sx={{ mr: 2 }} />
          Live at
          <Link variant="subtitle2" color="inherit">
            &nbsp;{info.country}
          </Link>
        </Box>

        <Box display="flex">
          <Iconify width={24} icon="fluent:mail-24-filled" sx={{ mr: 2 }} />
          {info.email}
        </Box>

        <Box display="flex">
          <Iconify width={24} icon="ic:round-business-center" sx={{ mr: 2 }} />
          {info.role} {`at `}
          <Link variant="subtitle2" color="inherit">
            &nbsp;{info.company}
          </Link>
        </Box>

        <Box display="flex">
          <Iconify width={24} icon="ic:round-business-center" sx={{ mr: 2 }} />
          {`Studied at `}
          <Link variant="subtitle2" color="inherit">
            &nbsp;{info.school}
          </Link>
        </Box>
      </Stack>
    </Card>
  );

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={handleAttach}>
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>

          <Fab size="small" color="inherit" variant="softExtended">
            <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
            Streaming
          </Fab>
        </Stack>

        <Button variant="contained">Post</Button>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {_socials.map((social) => (
          <Stack
            key={social.label}
            spacing={2}
            direction="row"
            sx={{ wordBreak: 'break-all', typography: 'body2' }}
          >
            {social.value === 'facebook' && <FacebookIcon />}
            {social.value === 'instagram' && <InstagramIcon />}
            {social.value === 'linkedin' && <LinkedinIcon />}
            {social.value === 'twitter' && <TwitterIcon />}

            <Link color="inherit">
              {social.value === 'facebook' && info.socialLinks.facebook}
              {social.value === 'instagram' && info.socialLinks.instagram}
              {social.value === 'linkedin' && info.socialLinks.linkedin}
              {social.value === 'twitter' && info.socialLinks.twitter}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderFollows}
          {renderAbout}
          {renderSocials}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {renderPostInput}

          {posts.map((post) => (
            <ProfilePostItem key={post.id} post={post} />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
