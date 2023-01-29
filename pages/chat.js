import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useXMTPContext } from "../context/XMTPContext";
import { useRouter } from "next/router";

import NewConversation from "@/components/chat/NewConversation";
import ConversationsList from "@/components/chat/ConversationsList";
import ChatBox from "@/components/chat/ChatBox";
import { Toaster } from "react-hot-toast";

const PATHNAME = "/chat";

export default function Chat() {
  const { account } = useMoralis();
  const { client, initClient, conversation, setConversation, setClient } =
    useXMTPContext();
  const router = useRouter();

  useEffect(() => {
    setClient(false);
    setConversation(false);
  }, [account]);

  return (
    <main className="margin-top-content">
      <Toaster />
      {account && client ? (
        <div>
          <NewConversation />
          <div className="flex">
            <ConversationsList />
            {conversation && <ChatBox conversation={conversation} />}
          </div>
        </div>
      ) : account ? (
        <div>
          <div>Please sign</div>
          <button
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            onClick={initClient}
          >
            Connect to XMTP
          </button>
        </div>
      ) : (
        <div>need an account to use XMTP</div>
      )}
    </main>
  );
}
