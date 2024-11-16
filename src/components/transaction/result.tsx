
'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"

export default function Result(params: {
    txHash: string,
    sendingTx: boolean,
}) {
    useEffect(() => {
        if(params.sendingTx) {
            setIsOpen(true);
        }
    }, [params.sendingTx]);
    const [isOpen, setIsOpen] = useState(false)
    return <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Your transfer request is processing</DialogTitle>
                    <DialogDescription>
                        This may take a few seconds.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </>
}
