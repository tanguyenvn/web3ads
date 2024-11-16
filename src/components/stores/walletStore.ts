'use client'
import { createBicoPaymasterClient, createNexusClient, NexusClient } from '@biconomy/sdk';
import { AuthAdapter } from '@web3auth/auth-adapter';
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { Chain, Hex, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { create } from 'zustand'
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


export interface WalletState {
  provider: IProvider| null;
  address: Hex | undefined;
  smartAddress: Hex | undefined;
  nexusClient: NexusClient | null;
  chain: Chain | null;
  init: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  setProvider : ( provider: IProvider| null) => Promise<void>;
  setNexusClient: (nexusClient: NexusClient | null) => void;
  removeProvider: () => void;
}
  
const bundlerUrl = "https://bundler.biconomy.io/api/v3/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
// const paymasterUrl = "https://paymaster.biconomy.io/api/v2/84532/F7wyL1clz.75a64804-3e97-41fa-ba1e-33e98c2cc703"; 
const paymasterUrl = "https://paymaster.biconomy.io/api/v2/84532/LbZVPCC9h.5cc473f0-4bff-424d-8148-831d519fc685"; 

export const useWalletStore = create<WalletState>((set, get) => ({
  provider : null,
  address: undefined,
  smartAddress: undefined,
  nexusClient: null,
  chain: baseSepolia,

  init: async () => {
    const state = get();
    web3authInstance.configureAdapter(authAdapter);
    if (state.address) return;
    await web3authInstance.init();
    console.log(web3authInstance.connected)
    const address = await web3authInstance.provider?.request({
      method: "eth_accounts",
    });
    console.log(address);

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
        paymaster: createBicoPaymasterClient({paymasterUrl})
    });
    const smartAccountAddress = nexusClient.account.address;
    
    console.log("connected");

    const {provider} = web3authInstance;
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });
    console.log(localAddress)
    set(() => ({
        provider: provider,
        address: localAddress?.at(0),
        smartAddress: smartAccountAddress,
        nexusClient: nexusClient,
    }))
  },
  login : async () => {
    const state = get();
    if (state.address) {
      return;
    }

    const provider = await web3authInstance.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });

    set(() => ({
      provider: provider,
      address: localAddress?.at(0),
    })) 
  },
  logout: async () =>{
    await web3authInstance.logout();
    set(() => ({
      provider: undefined,
      address: undefined,
    }))  
  },
  setProvider: async ( provider ) =>  {
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });
    

    set(() => ({
        provider: provider,
        address: localAddress?.at(0),
    }))
  },
  removeProvider: () => set({ provider: null }),
  setNexusClient: (nexusClient: NexusClient | null) => set({ nexusClient }),
}))