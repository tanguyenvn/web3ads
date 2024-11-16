"use client"

import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createPublicClient, http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"
import { useRouter } from 'next/navigation'
const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: http() 
})

export default function Home() {
  const { init, smartAddress} = useWalletStore();
  const [balance, setBalance] = useState(10n)
  const router = useRouter();
  useEffect(() => {
    async function initalize() {
      if ( smartAddress ) {
        const bal = await publicClient.getBalance({
          address: smartAddress
        })
        console.log(bal)
        setBalance(bal)
      } else {
        await init();
        console.log(smartAddress)
      }
    }
    initalize()
    console.log("useEffect")
  }, [smartAddress, init]);

  return <div className="grid justify-center">
      <Card> 
        <CardHeader>
          Address: {smartAddress}
          <br />
          Balance: {balance}
          <br />
          Chain: {baseSepolia.name}
        </CardHeader>
      </Card>

      <div className="flex gap-2 justify-between">
        <Button onClick={() => router.push("/wallet/transfer")} > Send </Button>
        <Button onClick={() => router.push("/wallet/receive")}> Receive </Button>
      </div>
  </div>
}