"use client";

import { Button } from "@/components/ui/button";

import { Web3AuthNoModal } from "@web3auth/no-modal";
import {
  WALLET_ADAPTERS,
  CHAIN_NAMESPACES,
  IProvider,
  WEB3AUTH_NETWORK,
  UX_MODE,
} from "@web3auth/base";
import { AuthAdapter } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { useEffect, useState } from "react";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [account, setAccount] = useState<string | null>(null);

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
    const init = async () => {
      try {
        setWeb3auth(web3authInstance);

        await web3authInstance.init();
        setProvider(web3authInstance.provider);

        if (web3authInstance.connected) {
          setLoggedIn(true);
          setProvider(web3authInstance.provider);
          console.log("connected");
          const address: any = await web3authInstance.provider?.request({
            method: "eth_accounts",
          });
          console.log(address);
          setAccount(address[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
  };

  return (
    <>
      <h1>Hello, Home page!</h1>
      <p>
        {loggedIn ? (
          `Logged in as ${account}`
        ) : (
          <Button onClick={() => login()}>Login</Button>
        )}
      </p>

      <hr></hr>
      <Button>User Wallet</Button>
      <Button>Dashboard</Button>
    </>
  );
}
