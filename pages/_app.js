import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import { MoralisProvider } from "react-moralis";
import { LensProvider } from "../context/LensContext";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../constants/lensConstants";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={apolloClient}>
          <LensProvider>
            <Navbar />
            <Component {...pageProps} />
          </LensProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
}
