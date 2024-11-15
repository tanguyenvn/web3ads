"use client"

import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"

const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: http() 
})


export default function Home() {
  const {address, init} = useWalletStore();
  const [balance, setBalance] = useState(10n)
  
  useEffect(() => {
    async function initalize() {
      if ( address ) {
        const bal = await publicClient.getBalance({
          address: address
        })
        setBalance(bal)
      } else {
        await init();
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
        <Button> Send </Button>
        <Button> Receive </Button>
      </div>
  </div>
}