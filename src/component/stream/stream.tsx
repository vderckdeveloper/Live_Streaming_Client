"use client";
import { useState } from 'react';
import styles from '@/styles/stream/stream.module.css';

function Stream() {

    const [ screenNum, setScreenNum ] = useState<number>(1);

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                {/* my screen */}
                <div className={styles['screen']}>
                    <div className={styles['video-box']} style={{backgroundColor: 'black'}}>
                        <video autoPlay playsInline muted></video>
                    </div>
                    <h2 className={styles['video-text']}>내 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']}>
                    <div className={styles['video-box']} style={{backgroundColor: 'black'}}>
                        <video autoPlay playsInline muted></video>
                    </div>
                    <h2 className={styles['video-text']}>참여자1 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']}>
                    <div className={styles['video-box']} style={{backgroundColor: 'black'}}>
                        <video autoPlay playsInline muted></video>
                    </div>
                    <h2 className={styles['video-text']}>참여자2 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']}>
                    <div className={styles['video-box']} style={{backgroundColor: 'black'}}>
                        <video autoPlay playsInline muted></video>
                    </div>
                    <h2 className={styles['video-text']}>참여자3 화면</h2>
                </div>
            </div>
        </section>
    )
}

export default Stream;