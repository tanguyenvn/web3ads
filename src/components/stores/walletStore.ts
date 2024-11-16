import { NexusClient } from '@biconomy/sdk';
import { AuthAdapter } from '@web3auth/auth-adapter';
import { CHAIN_NAMESPACES, IProvider, UX_MODE, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { Hex } from 'viem';
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
web3authInstance.configureAdapter(authAdapter);


export interface WalletState {
  provider: IProvider| null;
  address: Hex | undefined;
  nexusClient: NexusClient | null;
  init: () => Promise<void>;
  setProvider : ( provider: IProvider| null) => Promise<void>;
  setNexusClient: (nexusClient: NexusClient | null) => void;
  removeProvider: () => void;
}
  
export const useWalletStore = create<WalletState>((set, get) => ({
  provider : null,
  address: undefined,
  nexusClient: null,

  init: async () => {
    await web3authInstance.init();
    if (web3authInstance.connected) {
      const {provider} = web3authInstance;
      const localAddress = await provider?.request<undefined, Hex[]>({
        method: "eth_accounts",
      });
      set(() => ({
          provider: provider,
          address: localAddress?.shift(),
      }))
    }
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
      address: localAddress?.shift(),
    })) 
  },

  setProvider: async ( provider ) =>  {
    const localAddress = await provider?.request<undefined, Hex[]>({
      method: "eth_accounts",
    });
    

    set(() => ({
        provider: provider,
        address: localAddress?.shift(),
    }))
  },
  removeProvider: () => set({ provider: null }),
  setNexusClient: (nexusClient: NexusClient | null) => set({ nexusClient }),
}))