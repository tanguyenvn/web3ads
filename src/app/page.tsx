"use client";

import { Button } from "@/components/ui/button";

import { useWalletStore } from "@/components/stores/walletStore";
import { createNexusClient } from "@biconomy/sdk";
import { AuthAdapter } from "@web3auth/auth-adapter";
import {
  CHAIN_NAMESPACES,
  IProvider,
  UX_MODE,
  WALLET_ADAPTERS,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { useEffect, useState } from "react";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

export default function Home() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [smartAccount, setSmartAccount] = useState<string | null>(null);
  const walletStore = useWalletStore();
  const clientId =
    "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ";
  const bundlerUrl = "https://bundler.biconomy.io/api/v3/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";

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
          walletStore.setProvider(web3authInstance.provider);

          // EOA address
          const address = await web3authInstance.provider?.request({
            method: "eth_accounts",
          });
          console.log(address);
          setAccount((address as string[])[0]);

          // Smart Account
          const privateKey = await web3authInstance.provider?.request({
            method: "eth_private_key",
          });
          const account = privateKeyToAccount(`0x${privateKey}`)
          const nexusClient = await createNexusClient({ 
              signer: account, 
              chain: baseSepolia,
              transport: http(), 
              bundlerTransport: http(bundlerUrl), 
          });
          const smartAccountAddress = nexusClient.account.address;
          setSmartAccount(smartAccountAddress);
          walletStore.setNexusClient(nexusClient);

          console.log("connected");
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

    walletStore.setProvider(web3authProvider);
  };

  return (
    <>
      <h1>Hello, Home page!</h1>
      <p>
        {loggedIn ? (
          <>
            Logged in as EOA:
            <a
              className="text-blue-500 underline"
              href={`https://eth.blockscout.com/address/${account}`}
              target="_blank"
              rel="noreferrer"
            >
              {account}
            </a>
            <br />
            Smart Account:
            <a
              className="text-blue-500 underline"
              href={`https://eth.blockscout.com/address/${smartAccount}`}
              target="_blank"
              rel="noreferrer"
            >
              {smartAccount}
            </a>
            <br />
            <Button
              onClick={() => {
                web3auth?.logout();
                setLoggedIn(false);
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
      <Button>User Wallet</Button>
      <Button>Dashboard</Button>
    </>
  );
}
