import { useState, useContext, createContext, useEffect } from "react";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";

// Context config
export const XMTPContext = createContext();
export const useXMTPContext = () => {
  return useContext(XMTPContext);
};

export function XMTPProvider({ children }) {
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const { account } = useMoralis();

  async function initClient() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const xmtp = await Client.create(signer, {
        env: "dev",
      });
      setClient(xmtp);
    } catch (e) {
      console.error(e);
    }
  }

  // useEffect(() => {
  //   const readClient = window.localStorage.getItem("xmtp");
  //   if (readClient) {
  //     setClient(readClient);
  //   }
  //   if (!account) {
  //     window.localStorage.removeItem("xmtp");
  //   }
  // }, [account]);

  // useEffect(() => {
  //   if (client) {
  //     window.localStorage.setItem("xmtp", client);
  //   }
  // }, [client]);

  return (
    <XMTPContext.Provider
      value={{
        initClient,
        client,
        setClient,
        conversation,
        setConversation,
        messages,
        setMessages,
      }}
    >
      {children}
    </XMTPContext.Provider>
  );
}
