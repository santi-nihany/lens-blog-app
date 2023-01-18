import {
  challenge,
  apolloClient,
  authenticate,
} from "../constants/lensConstants";
import { useState, useContext, createContext, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

export const LensContext = createContext();

export const useLensContext = () => {
  return useContext(LensContext);
};

export function LensProvider({ children }) {
  // profileId: state of the context
  const [profileId, setProfileId] = useState();
  const [token, setToken] = useState();

  const { account } = useMoralis();

  const signIn = async () => {
    try {
      const challengeInfo = await apolloClient.query({
        query: challenge,
        variables: {
          address: account,
        },
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const signature = await signer.signMessage(
        challengeInfo.data.challenge.text
      );
      console.log(`holaa : ${challengeInfo.data.challenge.text}`);

      // mutate: send data
      const authData = await apolloClient.mutate({
        mutation: authenticate,
        variables: {
          address: account,
          signature: signature,
        },
      });

      // get AccessToken
      const {
        data: {
          authenticate: { accessToken },
        },
      } = authData;

      setToken(accessToken);
    } catch (error) {
      console.log("Error signing in", error);
    }
  };

  const getProfileId = async function () {
    //const defaultProfile = await
  };

  useEffect(() => {
    const readToken = window.localStorage.getItem("lensToken");
    if (readToken) {
      setToken(readToken);
    }
    if (account && !token && !readToken) {
      signIn();
    }
    if (!account) {
      window.localStorage.removeItem("lensToken");
    }
  }, [account]);

  // has a dependency on the token, means that listens every time the token changes
  useEffect(() => {
    if (token) {
      window.localStorage.setItem("lensToken", token);
    }
  }, [token]);

  return (
    <LensContext.Provider value={{ profileId, token }}>
      {children}
    </LensContext.Provider>
  );
}
