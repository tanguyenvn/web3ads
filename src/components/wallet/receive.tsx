
'use client'
import { useWalletStore } from "@/components/stores/walletStore";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function Receive() {
    const { smartAddress: address } = useWalletStore();
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <Button
            className="rounded-full"
            onClick={() => setIsOpen(true)}
        >
            Receive
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-6 w-[350px]">
                <DialogTitle>
                    <div className="text-xl font-bold text-center">Receive</div>
                </DialogTitle>
                <DialogHeader>
                    <div style={{ height: "auto", margin: "0 auto", maxWidth: 250 }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto" }}
                            value={address || ""}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                </DialogHeader>
                <DialogFooter>
                    <Button className="rounded-full w-full" onClick={() => {
                        toast({
                            title: "Copied to clipboard",
                        })
                        navigator.clipboard.writeText(address || "")
                    }}>{address?.slice(0, 6)}...{address?.slice(-4)}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}
