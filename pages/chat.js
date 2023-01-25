import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useXMTPContext } from "../context/XMTPContext";
import { useRouter } from "next/router";

const PATHNAME = "/chat";

export default function Chat() {
  const { account } = useMoralis();
  const { client, initClient } = useXMTPContext();
  const router = useRouter();

  useEffect(() => {
    if (!client && account && router.pathname == PATHNAME) {
      initClient();
    }
  }, [account, router.pathname]);

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
