"use client"
import { Ad } from "@/app/utils/interface"
import AdsCard from "@/components/ads/ads"
import { useWalletStore } from "@/components/stores/walletStore"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Hex, HttpRequestError, parseEther } from "viem"

export default function Home() {
    const [amount, setAmount] = useState("")
    const [recipient, setRecipient] = useState("")
    const [showAds, setShowAds] = useState(false)
    const [gaslessDone, setGaslessDone] = useState(false)
    const {nexusClient, smartAddress, chain, balance} = useWalletStore();
    const [adUrl, setAdUrl] = useState<string>("");
    const router = useRouter();
    const {toast} = useToast();

    const sendTransaction = async () => {
        if (!nexusClient) {
            toast({title: "Nexus client not initialized"})
            return;
        }
        // validate amount and recipient
        if (amount === "" || recipient === "") {
            toast({title: "Amount and recipient are required"})
            // alert("Amount and recipient are required")
            return;
        }
        toast({title: "sending transaction..."});
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
        const receipt = await nexusClient.waitForTransactionReceipt({ hash });
        toast({title : `Transaction receipt:  ${receipt.transactionHash}`})
    }

    const showAdsForGasless = async () => {
        if (!nexusClient) {
            toast({title: "Nexus client not initialized"})
            return;
        }
        // validate amount and recipient
        if (amount === "" || recipient === "") {
            toast({title: "Amount and recipient are required"})
            // alert("Amount and recipient are required")
            return;
        }
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

    return (
        <div className="grid justify-center p-4 gap-3 w-[500px]">
            <div className="flex justify-between w-[500px] items-center">
                <Button className="bg-white text-black rounded-2xl text-2xl" onClick={() => router.push("/wallet")}>&#8249;</Button>
                <div className="text-xl font-bold text-center">Transfer</div>
                <span className="text-xs text-center rounded-full bg-gray-100 h-7 border border-gray-300 px-2 py-1 flex items-center">{chain.name}</span>
            </div>
            <Card className="w-full rounded-xl bg-gray-100"> 
                <CardHeader>
                    <div className="flex justify-between">
                        <div>
                            <div className="text-sm font-bold">Sending from</div>
                            <div>{smartAddress?.slice(0, 7)}...{smartAddress?.slice(-5)}</div>   
                        </div>
                        <div>
                            <div className="text-sm font-bold">Available Balance</div>
                            <div>{balance}</div>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <div className="mb-5">
                {/* Token */}
                <div>
                    <label className="text-sm font-semibold">Select Token</label>
                    <Select>
                        <SelectTrigger className="w-[180px] rounded-full px-3 w-full">
                            <SelectValue placeholder="ETH" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="eth">ETH</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Recipient */}
                <div className="mt-2">
                    <label className="text-sm font-semibold">Send to</label>
                    <Input className="rounded-full text-sm" onChange={(e) => setRecipient(e.target.value)} value={recipient} placeholder="Enter recipient address" />
                </div>

                {/* Amount */}
                <div className="mt-2">
                    <label className="text-sm font-semibold">Amount</label>
                    <Input className="rounded-full" onChange={(e) => setAmount(e.target.value)} value={amount} placeholder="0" />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
                { !gaslessDone && <Button className="w-full rounded-full" onClick={() => showAdsForGasless()}> Watch Ads For Gasless</Button> }
                <Button className="w-full rounded-full" onClick={() => { sendTransaction() }}>Send</Button>
            </div>
            {gaslessDone && <div> Gasless Transaction Enabled </div>}
            {showAds && <AdsCard adUrl={adUrl} onClosed={(result) => {onAdsEnded(result)}} />}
        </div>
    )
}
