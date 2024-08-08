import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/stream/screen.module.css';

function Screen() {

    const [screenNum, setScreenNum] = useState<number>(1);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
    }, []);

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                {/* my screen */}
                <div className={styles['on-screen']}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={videoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>내 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['off-screen']}>
                    <div className={styles['svg-box']}>
                        <div className={styles['svg-content']}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L20.7071 4.70711Z" fill="#ffffff" />
                                <path d="M13 5C13.8933 5 14.7181 5.29281 15.3839 5.78768L13.9383 7.2333C13.6585 7.08438 13.3391 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 15.5959 4.26065 16.131 4.67416 16.4974L3.25865 17.9129C2.48379 17.1834 2 16.1482 2 15V9C2 6.79086 3.79086 5 6 5H13Z" fill="#ffffff" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13 17H9.82843L7.82843 19H13C15.0938 19 16.8118 17.3913 16.9855 15.3425L20.306 16.8424C21.1003 17.2012 22 16.6203 22 15.7488V8.27144C22 7.34868 21.0019 6.77121 20.202 7.23108L18.7799 8.04856L15 11.8284V15C15 16.1046 14.1046 17 13 17ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544Z" fill="#ffffff" />
                            </svg>
                        </div>
                    </div>
                    <h2 className={styles['svg-text']}>참여자1 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['off-screen']}>
                    <div className={styles['svg-box']}>
                        <div className={styles['svg-content']}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L20.7071 4.70711Z" fill="#ffffff" />
                                <path d="M13 5C13.8933 5 14.7181 5.29281 15.3839 5.78768L13.9383 7.2333C13.6585 7.08438 13.3391 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 15.5959 4.26065 16.131 4.67416 16.4974L3.25865 17.9129C2.48379 17.1834 2 16.1482 2 15V9C2 6.79086 3.79086 5 6 5H13Z" fill="#ffffff" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13 17H9.82843L7.82843 19H13C15.0938 19 16.8118 17.3913 16.9855 15.3425L20.306 16.8424C21.1003 17.2012 22 16.6203 22 15.7488V8.27144C22 7.34868 21.0019 6.77121 20.202 7.23108L18.7799 8.04856L15 11.8284V15C15 16.1046 14.1046 17 13 17ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544Z" fill="#ffffff" />
                            </svg>
                        </div>
                    </div>
                    <h2 className={styles['svg-text']}>참여자1 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['off-screen']}>
                    <div className={styles['svg-box']}>
                        <div className={styles['svg-content']}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <path d="M20.7071 4.70711C21.0976 4.31658 21.0976 3.68342 20.7071 3.29289C20.3166 2.90237 19.6834 2.90237 19.2929 3.29289L3.29289 19.2929C2.90237 19.6834 2.90237 20.3166 3.29289 20.7071C3.68342 21.0976 4.31658 21.0976 4.70711 20.7071L20.7071 4.70711Z" fill="#ffffff" />
                                <path d="M13 5C13.8933 5 14.7181 5.29281 15.3839 5.78768L13.9383 7.2333C13.6585 7.08438 13.3391 7 13 7H6C4.89543 7 4 7.89543 4 9V15C4 15.5959 4.26065 16.131 4.67416 16.4974L3.25865 17.9129C2.48379 17.1834 2 16.1482 2 15V9C2 6.79086 3.79086 5 6 5H13Z" fill="#ffffff" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M13 17H9.82843L7.82843 19H13C15.0938 19 16.8118 17.3913 16.9855 15.3425L20.306 16.8424C21.1003 17.2012 22 16.6203 22 15.7488V8.27144C22 7.34868 21.0019 6.77121 20.202 7.23108L18.7799 8.04856L15 11.8284V15C15 16.1046 14.1046 17 13 17ZM17 13.1544L20 14.5096V9.65407L17 11.3786V13.1544Z" fill="#ffffff" />
                            </svg>
                        </div>
                    </div>
                    <h2 className={styles['svg-text']}>참여자1 화면</h2>
                </div>
            </div>
        </section>
    )
}

export default Screen;