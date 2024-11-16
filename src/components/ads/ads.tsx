
'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
    onClosed: ( result: boolean) => void
}) {
    const { secondsLeft, isActive, handleRestart } = useCountdownTimer();
    const [ adsUrl, setAdsUrl ] = useState<string>("");

    useEffect(() => {
        // call api to end get ads
        handleRestart(5);
        setAdsUrl(params.adUrl)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if ( !isActive && adsUrl ) {
            params.onClosed(secondsLeft === 0 )
        }
    }, [isActive, adsUrl, params, secondsLeft])

    const close = () => {
        // call api to end ads
        params.onClosed(secondsLeft === 0)
    }

    return <div>
        <Card>
            <CardHeader>
            Ads will close in {secondsLeft}

            </CardHeader>
            <CardContent>
                {
                    adsUrl &&
                    <Image src={adsUrl} alt="Ads" width={200} height={200}/>
                }

            </CardContent>

            <CardFooter>
            
            <Button disabled={isActive || !adsUrl } onClick={close}> Close </Button>

            </CardFooter>
        </Card>

    </div>
}