"use client"

import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createPublicClient, formatEther, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  const { smartAddress, chain } = useWalletStore();
  const [balance, setBalance] = useState("")
  const router = useRouter();

  useEffect(() => {
    async function initalize() {
      if ( smartAddress ) {
        const publicClient = createPublicClient({ 
          chain: chain,
          transport: http() 
        })
        
        const weiBalance = await publicClient.getBalance({
          address: smartAddress
        })
        console.log(weiBalance)
        setBalance(formatEther(weiBalance).toString())
      }
    }
    initalize()
    console.log("useEffect")
  }, [smartAddress]);

  return (
    <div className="grid justify-center p-4 gap-3 w-[600px]">
      {/* NAVBAR */}
      <div className="flex gap-2 justify-between w-[600px]">
        <div className="flex gap-2">
          <Button className="rounded-full bg-blue-500" onClick={() => router.push("/")}>Home</Button>
          <Button className="rounded-full bg-gray-500" onClick={() => router.push("/wallet/receive")}>Activity</Button>
        </div>
        {/* Chain */}
        <Select>
          <SelectTrigger className="w-[180px] rounded-full bg-gray-500 text-white">
            <SelectValue placeholder="Chain: Base Sepolia" />
          </SelectTrigger>
          <SelectContent>
              <SelectItem value="baseSepolia">Base Sepolia</SelectItem>
              <SelectItem value="sepolia">Ethereum Sepolia</SelectItem>
              <SelectItem value="sepolia">Polygon Amoy</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="w-full rounded-xl bg-gray-100"> 
        <CardHeader>
          <div className="mb-5">
            <strong>Smart Address:</strong> {smartAddress}
            <br />
            <strong>Balance:</strong> {balance}
          </div>
          <div className="flex justify-end gap-2">
            <Button className="bg-blue-500 rounded-xl" onClick={() => router.push("/wallet/transfer")} > Send </Button>
            <Button className="bg-blue-500 rounded-xl" onClick={() => router.push("/wallet/receive")}> Receive </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
