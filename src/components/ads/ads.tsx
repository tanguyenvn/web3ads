
'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCountdownTimer } from "@/lib/countdown";
import Image from "next/image";
import { useEffect, useState } from "react";

// const imageLoader = ({ src, width, quality }: {src: string, width: number, quality?: number}) => {
//     return `${src}?w=${width}&q=${quality || 75}`
//   }

// get ads from server
// on close call end ads api to server
export default function AdsCard(params: {
    adUrl: string,
    onClosed: (result: boolean) => void
}) {
    const { secondsLeft, isActive, handleRestart } = useCountdownTimer();
    const [adsUrl, setAdsUrl] = useState<string>("");

    useEffect(() => {
        // call api to end get ads
        handleRestart(15);
        setAdsUrl(params.adUrl)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!isActive && adsUrl) {
            params.onClosed(secondsLeft === 0)
        }
    }, [isActive, adsUrl, params, secondsLeft])

    return <>
        <div className="absolute w-full h-full bg-black opacity-50 top-0 left-0" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card>
                <CardHeader className="text-center">
                    Advertisement will close in {secondsLeft}
                </CardHeader>
                <CardContent>
                    {
                        adsUrl &&
                        <Image src={adsUrl} alt="Ads" width={400} height={400} />
                    }
                </CardContent>
            </Card>

        </div>
    </>
}
