import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/stream/screen.module.css';

interface Refs {
    // my side
    videoRef: React.RefObject<HTMLVideoElement>;
    streamRef: React.MutableRefObject<MediaStream | null>;
    // peer side
    firstPeerVideoRef: React.RefObject<HTMLVideoElement>;
    secondPeerVideoRef: React.RefObject<HTMLVideoElement>;
    thirdPeerVideoRef: React.RefObject<HTMLVideoElement>;
}

interface ScreenProps {
    isMyWebcamLoading: boolean;
    isOnlyMyVideoAvailable: boolean;
    setIsOnlyMyVideoAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    refs: Refs;
}

const Screen = ({ isMyWebcamLoading, isOnlyMyVideoAvailable, setIsOnlyMyVideoAvailable, refs }: ScreenProps) => {

    const { videoRef, firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef } = refs;

    const [isFirstPeerVideoReady, setIsFirstPeerVideoReady] = useState<boolean>(false);
    const [isSecondPeerVideoReady, setIsSecondPeerVideoReady] = useState<boolean>(false);
    const [isThirdPeerVideoReady, setIsThirdPeerVideoReady] = useState<boolean>(false);

    // update peer video ready
    useEffect(() => {
        // Utility to handle setting video readiness state
        const handleVideoReady = (videoElement: HTMLVideoElement, setVideoReady: React.Dispatch<React.SetStateAction<boolean>>): void => {
            if (videoElement && videoElement.srcObject instanceof MediaStream && videoElement.srcObject.active) {
                setVideoReady(true);
                setIsOnlyMyVideoAvailable(false);
            }
        };

        // make peer video ref object
        const peerVideos = [
            { ref: firstPeerVideoRef, setReady: setIsFirstPeerVideoReady },
            { ref: secondPeerVideoRef, setReady: setIsSecondPeerVideoReady },
            { ref: thirdPeerVideoRef, setReady: setIsThirdPeerVideoReady }
        ];

        // define event listner and attach each event lister
        const eventListeners = peerVideos.map(({ ref, setReady }): (() => void) | undefined => {
            const videoElement = ref.current;
            if (videoElement) {
                // chekc if peer video is ready and if my video is the only video
                const handleMetadataLoaded = () => { handleVideoReady(videoElement, setReady), setIsOnlyMyVideoAvailable(false) };
                videoElement.addEventListener('loadedmetadata', handleMetadataLoaded);

                return () => videoElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
            }
        });

        return () => {
            eventListeners.forEach(cleanup => cleanup && cleanup());
        };
    }, [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef, setIsOnlyMyVideoAvailable]);

    // check if first peer disconnects video. it checks srcObject is 'null'
    useEffect(() => {
        // Access the video element from the ref
        const firstPeerVideoElement = firstPeerVideoRef.current;
        const secondPeerVideoElement = secondPeerVideoRef.current;
        const thirdPeerVideoElement = thirdPeerVideoRef.current;

        // Store the initial srcObject to track changes
        let lastFirstPeerSrcObject = firstPeerVideoElement ? firstPeerVideoElement.srcObject : null;
        let lastSecondPeerSrcObject = secondPeerVideoElement ? secondPeerVideoElement.srcObject : null;
        let lastThirdPeerSrcObject = thirdPeerVideoElement ? thirdPeerVideoElement.srcObject : null;

        // Set up an interval to periodically check the srcObject
        const interval = setInterval(() => {
            // First, ensure the video element exists and check if the srcObject has changed
            if (firstPeerVideoElement && firstPeerVideoElement.srcObject !== lastFirstPeerSrcObject) {
                // Update lastFirstPeerSrcObject with the current srcObject from the video element
                lastFirstPeerSrcObject = firstPeerVideoElement.srcObject;

                // If the current srcObject is null, change the screen state 
                if (!firstPeerVideoElement.srcObject) {
                    setIsFirstPeerVideoReady(false);
                }
            }

            // second peer video null check
            if (secondPeerVideoElement && secondPeerVideoElement.srcObject !== lastSecondPeerSrcObject) {
                lastSecondPeerSrcObject = secondPeerVideoElement.srcObject;

                if (!secondPeerVideoElement.srcObject) {
                    setIsSecondPeerVideoReady(false);
                }
            }

            // third peer video null check
            if (thirdPeerVideoElement && thirdPeerVideoElement.srcObject !== lastThirdPeerSrcObject) {
                lastThirdPeerSrcObject = thirdPeerVideoElement.srcObject;
                if (!thirdPeerVideoElement.srcObject) {
                    setIsThirdPeerVideoReady(false);
                }
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef]);

    return (
        <section className={styles['container']}>
            <div className={isOnlyMyVideoAvailable ? styles['my-only-screen-wrapper'] : styles['wrapper']}>
                {/* my screen */}
                <div className={isOnlyMyVideoAvailable ? styles['my-only-screen'] : styles['screen']}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={videoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>내 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isFirstPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={firstPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>상대방 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isSecondPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={secondPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>상대방 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isThirdPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={thirdPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>상대방 화면</h2>
                </div>
            </div>
            {
                isMyWebcamLoading
                &&
                <div className={styles['screen-loader-container']}>
                    <div className={styles['screen-loader-wrapper']}>
                        <span className={styles['screen-loader']}></span>
                    </div>
                </div>
            }
        </section >
    )
}

export default Screen;