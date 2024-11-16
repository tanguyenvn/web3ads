"use client"
import { Ad } from "@/app/utils/interface"
import AdsCard from "@/components/ads/ads"
import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Hex, HttpRequestError, parseEther } from "viem"

export default function Home() {
    const [amount, setAmount] = useState("")
    const [recipient, setRecipient] = useState("")
    const [showAds, setShowAds] = useState(false)
    const [gaslessDone, setGaslessDone] = useState(false)
    const { nexusClient, smartAddress, chain } = useWalletStore();
    const [adUrl, setAdUrl] = useState<string>("");

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
        let hash;
        try {
            hash = await nexusClient.sendTransaction({ calls:  
                [{to : recipient as Hex, value: parseEther(amount)}] },
            ); 
        } catch (e) {
            if (e instanceof HttpRequestError) {
                // if the error is 417 (webhook failed)
                alert("Webhook failed, trying again...")
            }
            return;
        }
        console.log("Transaction hash: ", hash) 
        const receipt = await nexusClient.waitForTransactionReceipt({ hash });
        console.log("Transaction receipt: ", receipt)
    }

    const showAdsForGasless = async () => {
        // fetch ad from backend api
        const res = await fetch("/api/ad-views?chain_id=" + chain?.id + "&from_address=" + smartAddress)
        const data = await res.json() as { data: Ad };
        const ad = data.data;

        setAdUrl(ad.url);
        setGaslessDone(false)
        setShowAds(true)
    }

    const onAdsEnded = async (result: boolean) => {
        setShowAds(false)
        setGaslessDone(result)
        if (result) {
            // call POST ad-views api to mark ad as viewed
            await fetch("/api/ad-views", {
                method: "POST",
                body: JSON.stringify({ chain_id: chain?.id, from_address: smartAddress })
            })
        }
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
            <Button onClick={() => showAdsForGasless()}> Watch Ads For Gasless</Button>

            <Button onClick={() => { sendTransaction() }}>Send</Button>
        </div>
        {gaslessDone && <div> Gasless Transaction Enabled </div>}
        {showAds && <AdsCard adUrl={adUrl} onClosed={(result) => {onAdsEnded(result)}} />}
    </div>
}