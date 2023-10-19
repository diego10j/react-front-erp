import { Helmet } from 'react-helmet-async';

import MarkdownView from 'src/sections/_examples/extra/markdown-view';

// ----------------------------------------------------------------------

export default function MarkdownPage() {
  return (
    <>
      <Helmet>
        <title> Components: Markdown</title>
      </Helmet>

      <MarkdownView />
    </>
  );
}
