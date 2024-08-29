import { useState, useEffect } from "react";

interface DateFormatOptions {
    month: 'long' | 'short' | 'narrow';
    day: 'numeric' | '2-digit';
    weekday: 'long' | 'short' | 'narrow';
    hour: 'numeric' | '2-digit';
    minute: 'numeric' | '2-digit';
    hour12: boolean;
}

export function useToolbar() {
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateCurrentTime = () => {
            const now: Date = new Date();
            const options: DateFormatOptions = { 
                month: 'long', day: 'numeric', weekday: 'long', 
                hour: 'numeric', minute: 'numeric', hour12: true 
            };
            const formattedTime = now.toLocaleDateString('ko-KR', options);
            setCurrentTime(formattedTime);
        };

        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return currentTime;
}
