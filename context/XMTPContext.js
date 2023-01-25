import { useState, useContext, createContext, useEffect } from "react";
import { Client, Conversation } from "@xmtp/xmtp-js";
import { ethers } from "ethers";

// Context config
export const XMTPContext = createContext();
export const useXMTPContext = () => {
  return useContext(XMTPContext);
};

export function XMTPProvider({ children }) {
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);

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

  return (
    <XMTPContext.Provider
      value={{ initClient, client, conversation, setConversation }}
    >
      {children}
    </XMTPContext.Provider>
  );
}
