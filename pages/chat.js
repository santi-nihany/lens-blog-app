import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useXMTPContext } from "../context/XMTPContext";

const PATHNAME = "/chat";

export default function Chat() {
  const { account } = useMoralis();
  const { client, initClient } = useXMTPContext();

  useEffect(() => {
    if (!client && account && window.location.pathname == PATHNAME) {
      initClient();
    }
  }, [account, window.location.pathname]);

  return (
    <div className="margin-top-content">
      {account && client ? (
        <div>Connected to XMTP Protocol!! WOOOO</div>
      ) : (
        <div>Please sign</div>
      )}
    </div>
  );
}
