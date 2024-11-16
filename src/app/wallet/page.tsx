"use client"

import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"
import { useRouter } from 'next/navigation'
const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: http() 
})


export default function Home() {
  const {address, init} = useWalletStore();
  const [balance, setBalance] = useState(10n)
  const router = useRouter();
  useEffect(() => {
    async function initalize() {
      if ( address ) {
        const bal = await publicClient.getBalance({
          address: address
        })
        console.log(bal)
        setBalance(bal)
      } else {
        await init();
        console.log(address)
      }
    }
    initalize()
    console.log("useEffect")
  }, [address, init]);

  return <div className="grid justify-center">
      <Card> 
        <CardHeader>
          Balance {balance}
        </CardHeader>
      </Card>

      <div>
        <Button onClick={() => router.push("/wallet/transfer")} > Send </Button>
        <Button onClick={() => router.push("/wallet/receive")}> Receive </Button>
      </div>
  </div>
}