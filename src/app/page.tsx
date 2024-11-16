"use client";

import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const walletStore = useWalletStore();
  const { address } = useWalletStore();
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

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
    setLoggedIn(true);
  };

  useEffect(() => {
    if (walletStore.web3authInstance?.status === "connected") {
      setLoggedIn(true);
      router.push("/wallet");
    }
  }, [walletStore.web3authInstance?.status, router]);

  return (
    <>
      <div>
        {loggedIn ? (
          <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">
                Connecting to your wallet...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-screen justify-center items-center">
              <div className="w-[400px] gap-8">
                <Card>
                  <CardHeader className="mt-2">
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription className="text-lg">
                      Enjoy duty-free transactions!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    <Button
                      className="rounded-full w-full"
                      onClick={() => login()}
                    >
                      Login with Google
                    </Button>
                    <Button
                      className="rounded-full w-full"
                      onClick={() => {
                        loginWithWorldID();
                        window.open("https://simulator.worldcoin.org/");
                      }}
                    >
                      Login with WorldID
                    </Button>
                    {/* <a
                      className="text-center text-sm text-blue-500 underline"
                      href="https://simulator.worldcoin.org/"
                      target="_blank"
                    >
                      WorldID Simulator
                    </a> */}
                    <div className="text-xs text-gray-500 text-center mt-6">
                      Powered by{" "}
                      <a href="https://w3ads.vercel.app" target="_blank">
                        Web3Ads
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
