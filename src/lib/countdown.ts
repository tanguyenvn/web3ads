import { useEffect, useState } from "react";
let timer: NodeJS.Timeout;

export const useCountdownTimer = () => {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (isActive && secondsLeft > 0) {
            timer = setInterval(() => {
                setSecondsLeft(prevSeconds => prevSeconds - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setIsActive(false); // Stop the countdown when it reaches zero
        }
        return () => {if (timer) clearInterval(timer)}; // Cleanup interval on component unmount
    }, [isActive, secondsLeft]);

    const handleRestart = (initialSeconds: number) => {
        setSecondsLeft(initialSeconds); // Reset to initial time
        setIsActive(true); // Restart the countdown
    };
    
    return {
        secondsLeft,
        isActive,
        handleRestart
    }
}