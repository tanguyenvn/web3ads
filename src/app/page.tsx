"use client";

import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import { AuthAdapter } from "@web3auth/auth-adapter";
import {
  CHAIN_NAMESPACES,
  UX_MODE,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
export default function Home() {
  const walletStore = useWalletStore();
  const {address, smartAddress} = useWalletStore();
  const router = useRouter()
  
  const clientId =
    "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1", // Please use 0x1 for Mainnet
    rpcTarget: "https://rpc.ankr.com/eth",
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3authInstance = new Web3AuthNoModal({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider,
  });

  const authAdapter = new AuthAdapter({
    adapterSettings: {
      uxMode: UX_MODE.REDIRECT,
      loginConfig: {
        google: {
          verifier: "w3ads",
          typeOfLogin: "google",
          clientId:
            "519228911939-snh959gvvmjieoo4j14kkaancbkjp34r.apps.googleusercontent.com", //use your app client id you got from google
        },
      },
    },
  });
  web3authInstance.configureAdapter(authAdapter);

  useEffect(() => {
    const initialize = async () => {
      await walletStore.init();
      console.log("done init", address)
    }
    initialize();
  }, []);

  const login = async () => {
    if (address) {
      return;
    }
    await walletStore.login();
  };

  return (
    <>
      <h1>Hello, Home page!</h1>
      <p>
        { !!address ? (
          <>
            Logged in as EOA:
            <a
              className="text-blue-500 underline"
              href={`https://eth.blockscout.com/address/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              {address}
            </a>
            <br />
            Smart Account:
            <a
              className="text-blue-500 underline"
              href={`https://eth.blockscout.com/address/${smartAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {smartAddress}
            </a>
            <br />
            <Button
              onClick={() => {
                walletStore.logout();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={() => login()}>Login</Button>
        )}
      </p>

      <hr></hr>
      <Button onClick={() => {router.push("/wallet")}}>User Wallet</Button>
      <Button onClick={() => {router.push("/dashboard")}}>Dashboard</Button>
    </>
  );
}
