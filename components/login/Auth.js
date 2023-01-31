import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";
import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";

export default function Auth() {
  const [smartAccount, setSmartAccount] = useState(null);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let configureLogin;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MAINNET),
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      //   sdkRef.current.showConnectModal();
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef.current.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    );

    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MAINNET,
        supportedNetworksIds: [ChainId.POLYGON_MAINNET],
      });
      await smartAccount.init();
      setSmartAccount(smartAccount);
      setLoading(false);
    } catch (err) {
      console.log("error setting up smart account", err);
    }
    console.log("smart account", smartAccount);
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3 modal not initialized");
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
  };

  return (
    <div style={containerStyle}>
      {!smartAccount && !loading && (
        <button style={buttonStyle} onClick={login}>
          Login
        </button>
      )}
      {loading && <p>Loading account details...</p>}
      {!!smartAccount && (
        <div style={detailsContainerStyle}>
          <p>Smart account address: {smartAccount.address}</p>
          <p>Your wallet address: {smartAccount.smartAccountState.owner}</p>
          <button style={buttonStyle} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const detailsContainerStyle = {
  marginTop: "10px",
};

const buttonStyle = {
  padding: " 14px",
  cursor: "pointer",
  width: "200px",
  background: "#f0f0f0",
  borderRadius: "999px",
  outline: "none",
  transition: "all 0.25s",
};

const containerStyle = {
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  paddingTop: "100px",
};
