"use client"
import AdsCard from "@/components/ads/ads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Home() {
    const [amount, setAmount] = useState("")
    const [showAds, setShowAds] = useState(false)
    const [gaslessDone, setGaslessDone] = useState(false)

    return <div className="grid justify-center">
        <div> Transfer </div>
        <Input onChange={(e) => setAmount(e.target.value)} value={amount} className="m-5"/>
        
        <div >
            <Button onClick={() => {
                setGaslessDone(false)
                setShowAds(true)
            }}> Watch Ads For Gasless</Button>
            
            <Button> Send </Button>
        </div>
        { gaslessDone && <div> Gasless Transaction Enabled </div>}
        { showAds && <AdsCard onClosed={( result ) => {
            setShowAds(false)
            setGaslessDone(result)
        }}/>}
    </div>
  }