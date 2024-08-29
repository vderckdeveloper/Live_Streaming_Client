import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useSetting() {
    // Current time
    const [currentTime, setCurrentTime] = useState('');
    // Screen resize
    const [browserWidth, setBrowserWidth] = useState<number>();

    // browser width - 1024px
    const oneThousandTwentyFourWidth = 1024

    // Router and path
    const router = useRouter();
    const pathName = usePathname();

    // Room code from the path
    const roomCode = pathName.split('/')[2];

    // Disconnect streaming and go back to the main page
    const onDisconnect = () => {
        router.push('/');
    }

    // Set initial screen size
    useEffect(() => {
        setBrowserWidth(window.innerWidth);
    }, []);

    // Observe screen resizing
    useEffect(() => {
        // browser width resize function 
        const handleResize = () => {
            setBrowserWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Update current time
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const formattedHours = (hours % 12 || 12).toString().padStart(2, '0'); // Ensure two digits for hours
            const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits for minutes
            const amPmKorean = hours < 12 ? '오전' : '오후'; // 오전 for AM, 오후 for PM

            // Formatting as "HH:MM 오전/오후"
            const formattedTime = `${formattedHours}:${formattedMinutes} ${amPmKorean}`;
            setCurrentTime(formattedTime);
        };

        // Update the time initially
        updateTime();

        // Set up an interval to update the time every second
        const intervalId = setInterval(updateTime, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return {
        currentTime,
        browserWidth,
        oneThousandTwentyFourWidth,
        roomCode,
        onDisconnect,
    };
}
