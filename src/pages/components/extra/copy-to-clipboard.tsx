import { Helmet } from 'react-helmet-async';

import CopyToClipboardView from 'src/sections/_examples/extra/copy-to-clipboard-view';

// ----------------------------------------------------------------------

export default function CopyToClipboardPage() {
  return (
    <>
      <Helmet>
        <title> Components: to Clipboard</title>
      </Helmet>

      <CopyToClipboardView />
    </>
  );
}
