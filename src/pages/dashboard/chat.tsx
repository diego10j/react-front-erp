import { Helmet } from 'react-helmet-async';

import { ChatView } from 'src/sections/chat/view';

// ----------------------------------------------------------------------

export default function ChatPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Chat</title>
      </Helmet>

      <ChatView />
    </>
  );
}
