"use client";
import { useState, useEffect } from "react";
import Image from "next/image"
import EduMeetLogoImage from '../../../public/image/toolbar/240730_eduMeet_logo_Ver1.0.png';

// style
import styles from '@/styles/toolbar/toolbar.module.css';

interface DateFormatOptions {
    month: 'long' | 'short' | 'narrow';
    day: 'numeric' | '2-digit';
    weekday: 'long' | 'short' | 'narrow';
    hour: 'numeric' | '2-digit';
    minute: 'numeric' | '2-digit';
    hour12: boolean;
}

function Toolbar() {

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

    return (
        <section className={styles['container']}>
            <nav className={styles['wrapper']}>
                <div className={styles['imageBox']}>
                    <Image src={EduMeetLogoImage} width={567} height={189} alt='로고 이미지' />
                </div>
                <div className={styles['timeBox']}>
                    <p>{currentTime}</p>
                </div>
            </nav>
        </section>
    )
}

export default Toolbar;