import { useXMTPContext } from "@/context/XMTPContext";
import { SortDirection } from "@xmtp/xmtp-js";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const PATHNAME = "/chat";

export default function ConversationsList() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState(false);

  let { setConversation, client, setClient, setMessages } = useXMTPContext();

  const { account } = useMoralis();

  async function ListConversations() {
    const conversations = await client.conversations.list();
    setConversations(conversations);
  }
  const router = useRouter();

  useEffect(() => {
    if (client && client.conversations && router.pathname === PATHNAME) {
      streamConvos();
    }
  }, [router.pathname, client, account]);

  async function streamConvos() {
    setLoading(true);
    ListConversations();
    setLoading(false);
    const stream = await client.conversations.stream();
    for await (const conversation of stream) {
      console.log("new conversation in real time! :", conversation);
      setLoading(true);
      ListConversations();
      setLoading(false);
      if (!client) break;
    }
  }

  return (
    <div style={convList}>
      <h1
        className="font-bold pb-2 mt-1"
        style={{
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #ddd",
        }}
      >
        Conversations
      </h1>
      {loading && <p>Loading conversations...</p>}
      {conversations && (
        <div>
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`chat/`}
              onClick={() => {
                setConversation(conversation);
              }}
            >
              <div
                className="hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                style={convContainerStyle}
              >
                <p style={{ marginLeft: "1rem" }}>
                  From: {conversation.peerAddress}
                </p>
                {conversation.context.metadata.title && (
                  <p style={{ marginLeft: "1rem" }}>
                    Title: {conversation.context.metadata.title}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const convList = {
  width: "50%",
  borderRadius: "6px",
  margin: "1rem",
  height: "23rem",
  backgroundColor: "rgb(254 255 245)",
};

const convContainerStyle = {
  padding: "10px 0px",
  borderBottom: "1px solid #ddd",
};
