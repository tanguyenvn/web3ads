"use client"
import AdsCard from "@/components/ads/ads"
import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Hex, parseEther } from "viem"

export default function Home() {
    const [amount, setAmount] = useState("")
    const [recipient, setRecipient] = useState("")
    const [showAds, setShowAds] = useState(false)
    const [gaslessDone, setGaslessDone] = useState(false)
    const { nexusClient } = useWalletStore();

    const sendTransaction = async () => {
        if (!nexusClient) {
            alert("Nexus client not initialized")
            return;
        }
        // validate amount and recipient
        if (amount === "" || recipient === "") {
            alert("Amount and recipient are required")
            return;
        }
        alert("sendTransaction" + amount + recipient)
        const hash = await nexusClient.sendTransaction({ calls:  
            [{to : recipient as Hex, value: parseEther(amount)}] },
        ); 
        console.log("Transaction hash: ", hash) 
        const receipt = await nexusClient.waitForTransactionReceipt({ hash });
        console.log("Transaction receipt: ", receipt)
    }

    return <div className="grid justify-center">
        <div> Transfer </div>
        <div>
            <label>Amount</label>
            <Input onChange={(e) => setAmount(e.target.value)} value={amount} className="m-5" />
        </div>
        <div>
            <label>Recipient</label>
            <Input onChange={(e) => setRecipient(e.target.value)} value={recipient} className="m-5" />
        </div>

        <div >
            <Button onClick={() => {
                setGaslessDone(false)
                setShowAds(true)
            }}> Watch Ads For Gasless</Button>

            <Button onClick={() => {
                sendTransaction()
            }}>Send</Button>
        </div>
        {gaslessDone && <div> Gasless Transaction Enabled </div>}
        {showAds && <AdsCard onClosed={(result) => {
            setShowAds(false)
            setGaslessDone(result)
        }} />}
    </div>
}