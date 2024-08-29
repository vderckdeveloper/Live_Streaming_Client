import { useState, useEffect } from "react";

// date format type
interface DateFormatOptions {
    month: 'long' | 'short' | 'narrow';
    day: 'numeric' | '2-digit';
    weekday: 'long' | 'short' | 'narrow';
    hour: 'numeric' | '2-digit';
    minute: 'numeric' | '2-digit';
    hour12: boolean;
}

export function useToolbar() {
    // current time
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        // update current time
        const updateCurrentTime = () => {
            const now: Date = new Date();
            const options: DateFormatOptions = { 
                month: 'long', day: 'numeric', weekday: 'long', 
                hour: 'numeric', minute: 'numeric', hour12: true 
            };
            const formattedTime = now.toLocaleDateString('ko-KR', options);
            setCurrentTime(formattedTime);
        };

        // execute current time function
        updateCurrentTime();

        // set interval
        const intervalId = setInterval(updateCurrentTime, 1000);

        // clean up interval
        return () => clearInterval(intervalId);
    }, []);

    return currentTime;
}
