'use client'
import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import QRCode from "react-qr-code";

export default function ReceivePage() {
    const {address, init } = useWalletStore();

    const { toast } = useToast()

    useEffect(() => {
        if ( !address ) {
            init()
        }
    })
    
    return <div>
        <Card>
            <CardHeader>
                Receive 
            </CardHeader> 
        </Card>

        <Card>
            <CardHeader>
            Your account address

            </CardHeader>
            <CardContent>
                <div style={{ height: "auto", margin: "0 auto", maxWidth: 64, width: "100%" }}>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={address || ""}
                        viewBox={`0 0 256 256`}
                    />
                </div>
                {address}
            </CardContent>

            <CardFooter className="flex justify-evenly">
                <Button onClick={() =>{ 
                    toast({
                    title: "Copied to clipboard",
                    })
                    navigator.clipboard.writeText(address||"")
                }}> Copy </Button>
                <Button> Share </Button>

            </CardFooter>
        </Card>

    </div>
    
  }