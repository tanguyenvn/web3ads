"use client";

import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const walletStore = useWalletStore();
  const { address, smartAddress } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      await walletStore.init();
      console.log("done init", address);
    };
    initialize();
  }, []);

  const login = async () => {
    if (address) {
      return;
    }
    await walletStore.login();
  };

  const loginWithWorldID = async () => {
    if (address) {
      return;
    }
    await walletStore.loginWithWorldID();
  };

  return (
    <>
      <h1>Hello, Home page!</h1>
      <p>
        {!!address ? (
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
          <>
            <Button onClick={() => login()}>Login with Google</Button>
            <Button onClick={() => loginWithWorldID()}>
              Login with WorldID
            </Button>
          </>
        )}
      </p>

      <hr></hr>
      <Button
        onClick={() => {
          router.push("/wallet");
        }}
      >
        User Wallet
      </Button>
      <Button
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        Dashboard
      </Button>
    </>
  );
}
