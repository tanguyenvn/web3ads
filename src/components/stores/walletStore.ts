"use client";
import {
  createBicoPaymasterClient,
  createNexusClient,
  NexusClient,
} from "@biconomy/sdk";
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
import { Chain, createPublicClient, formatEther, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { create } from "zustand";
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

// const web3authInstance = new Web3AuthNoModal({
//   clientId,
//   web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
//   privateKeyProvider,
// });

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
      jwt: {
        verifier: "w3a-worldcoin-demo",
        typeOfLogin: "jwt",
        clientId: "7u5jfJ3bakrfLBJYhyTquohpOth0Tmt7",
      },
    },
  },
});

export interface WalletState {
  provider: IProvider | null;
  address: Hex | undefined;
  smartAddress: Hex | undefined;
  balance: string;
  nexusClient: NexusClient | null;
  nonPaymasterNexusClient: NexusClient | null;
  chain: Chain;
  web3authInstance: Web3AuthNoModal | null;
  init: () => Promise<void>;
  login: () => Promise<void>;
  loginWithWorldID: () => Promise<void>;
  logout: () => Promise<void>;
  setProvider: (provider: IProvider | null) => Promise<void>;
  removeProvider: () => void;
}

const bundlerUrl =
  "https://bundler.biconomy.io/api/v3/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
const paymasterUrl =
  "https://paymaster.biconomy.io/api/v2/84532/LbZVPCC9h.5cc473f0-4bff-424d-8148-831d519fc685";

export const useWalletStore = create<WalletState>((set, get) => ({
  provider: null,
  address: undefined,
  smartAddress: undefined,
  nexusClient: null,
  nonPaymasterNexusClient: null,
  chain: baseSepolia,
  web3authInstance: null,
  balance: "0",

  init: async () => {
    const state = get();
    const web3authInstance = new Web3AuthNoModal({
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      privateKeyProvider,
    });

    web3authInstance.configureAdapter(authAdapter);
    if (state.address) return;
    await web3authInstance.init();

    if (!web3authInstance.connected) {
      set(() => ({
        web3authInstance,
      }));
      return;
    }

    const address = await web3authInstance.provider?.request({
      method: "eth_accounts",
    });
    console.log(address);

    // Smart Account
    const privateKey = await web3authInstance.provider?.request({
      method: "eth_private_key",
    });
    const account = privateKeyToAccount(`0x${privateKey}`);
    const nexusClient = await createNexusClient({
      signer: account,
      chain: get().chain,
      transport: http(),
      bundlerTransport: http(bundlerUrl),
      paymaster: createBicoPaymasterClient({ paymasterUrl }),
    });
    const nonPaymasterNexusClient = await createNexusClient({
      signer: account,
      chain: get().chain,
      transport: http(),
      bundlerTransport: http(bundlerUrl),
    });
    const smartAccountAddress = nexusClient.account.address;

    const publicClient = createPublicClient({
      chain: get().chain,
      transport: http(),
    });

    publicClient
      .getBalance({
        address: smartAccountAddress,
      })
      .then((balance) => {
        set(() => ({
          balance: formatEther(balance).toString().slice(0, 5),
        }));
      });

    console.log("connected");

    const { provider } = web3authInstance;
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });
    console.log(localAddress);
    set(() => ({
      provider: provider,
      address: localAddress?.at(0),
      smartAddress: smartAccountAddress,
      nexusClient: nexusClient,
      nonPaymasterNexusClient: nonPaymasterNexusClient,
      web3authInstance,
    }));
  },
  login: async () => {
    const state = get();
    if (state.address || state.web3authInstance === null) {
      return;
    }
    await state.web3authInstance.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
  },
  loginWithWorldID: async () => {
    const state = get();
    if (state.address || state.web3authInstance === null) {
      return;
    }

    const provider = await state.web3authInstance.connectTo(
      WALLET_ADAPTERS.AUTH,
      {
        loginProvider: "jwt",
        extraLoginOptions: {
          domain: "https://web3auth.jp.auth0.com",
          verifierIdField: "sub",
          connection: "worldcoin",
        },
      }
    );
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });

    set(() => ({
      provider: provider,
      address: localAddress?.at(0),
    }));
  },
  logout: async () => {
    const { web3authInstance } = get();
    set(() => ({
      provider: undefined,
      address: undefined,
      smartAddress: undefined,
      nexusClient: undefined,
    }));
    await web3authInstance?.logout();
  },
  setProvider: async (provider) => {
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });

    set(() => ({
      provider: provider,
      address: localAddress?.at(0),
    }));
  },
  removeProvider: () => set({ provider: null }),
}));
