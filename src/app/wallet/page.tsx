"use client";

import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Receive from "@/components/wallet/receive";
import { useRouter } from "next/navigation";

export default function Home() {
  const { smartAddress, balance, logout } = useWalletStore();
  const router = useRouter();

  return (
    <div className="grid justify-center p-4 gap-3 w-[600px]">
      {/* NAVBAR */}
      <div className="flex gap-2 justify-between w-[600px]">
        <div className="flex gap-2">
          <Button className="rounded-full" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button
            className="rounded-full bg-gray-500"
            onClick={() =>
              window.open(
                `https://base-sepolia.blockscout.com/address/${smartAddress}`,
                "_blank"
              )
            }
          >
            Activity
          </Button>
        </div>
        {/* Chain */}
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px] rounded-full bg-gray-500 text-white">
              <SelectValue placeholder="Chain: Base Sepolia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baseSepolia">Base Sepolia</SelectItem>
              <SelectItem value="ethereumSepolia">Ethereum Sepolia</SelectItem>
              <SelectItem value="polygonAmoy">Polygon Amoy</SelectItem>
              <SelectItem value="flowEVM">Flow EVM Testnet</SelectItem>
              <SelectItem value="neonEVM">Neon EVM Testnet</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="rounded-full bg-gray-500"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Log out
          </Button>
        </div>
      </div>

      <Card className="w-full rounded-xl bg-gray-100">
        <CardHeader>
          <div className="mb-5">
            <strong>Smart Address:</strong>{" "}
            <a
              className="text-blue-800 underline text-sm"
              href={`https://base-sepolia.blockscout.com/address/${smartAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {smartAddress}
            </a>
            <br />
            <strong>Balance:</strong> {balance} ETH
          </div>

          <div className="flex justify-end gap-2">
            <Button
              className="rounded-full"
              onClick={() => router.push("/wallet/transfer")}
            >
              Send
            </Button>
            <Receive />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
