
'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function Result(params: {
    txHash: string,
    sendingTx: boolean,
    isSuccess: boolean,
}) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (params.sendingTx) {
            setIsOpen(true);
        }
    }, [params.sendingTx, params.isSuccess, params.txHash]);

    return <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-8">
                {params.sendingTx ? (<DialogHeader>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    </div>
                    <DialogTitle className="text-center pt-4">Your transfer request is processing</DialogTitle>
                    <DialogDescription className="text-center mt-3">
                        This may take a few seconds.
                    </DialogDescription>
                </DialogHeader>) : params.isSuccess ? (
                    (
                        <DialogHeader>
                            <div className="flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-full border-4 border-green-500 bg-green-100">
                                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <DialogTitle className="text-center pt-4">Your transfer request is successful</DialogTitle>
                            <DialogDescription className="text-center mt-3">
                                <a className="text-blue-800 underline text-sm" href={`https://base-sepolia.blockscout.com/tx/${params.txHash}`} target="_blank" rel="noreferrer">View transaction on Blockscout</a>
                            </DialogDescription>
                        </DialogHeader>
                    )
                ) : (
                    <DialogHeader>
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-full border-4 border-red-500 bg-red-100">
                                    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <DialogTitle className="text-center pt-4">Your transfer request is failed</DialogTitle>
                        <DialogDescription className="text-center mt-3">
                            Please try again.
                        </DialogDescription>
                    </DialogHeader>
                )}
            </DialogContent>
        </Dialog>
    </>
}
