"use client";

import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Home() {
  const walletStore = useWalletStore();
  const { address, smartAddress } = useWalletStore();
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
  };

  return (
    <>
      <div>
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
                    <Button className="rounded-full w-full" onClick={() => login()}>Login with Google</Button>
                    <Button className="rounded-full w-full" onClick={() => loginWithWorldID()}>
                      Login with WorldID
                    </Button>
                    <div className="text-xs text-gray-500 text-center mt-6">Powered by Web3Ads</div>
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
