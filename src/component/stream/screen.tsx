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
    refs: Refs;
}

const Screen = ({ isMyWebcamLoading, refs }: ScreenProps) => {

    const { videoRef, firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef } = refs;

    const [isFirstPeerVideoReady, setIsFirstPeerVideoReady] = useState(false);
    const [isSecondPeerVideoReady, setIsSecondPeerVideoReady] = useState(false);
    const [isThirdPeerVideoReady, setIsThirdPeerVideoReady] = useState(false);

    // update first peer video element screen
    useEffect(() => {
        const fistPeerVideoElement = firstPeerVideoRef.current;
        // update first peer video screen
        if (fistPeerVideoElement) {
            const handleFirstPeerVideoSrcObjectChange = () => {
                if (fistPeerVideoElement.srcObject instanceof MediaStream && fistPeerVideoElement.srcObject.active) {
                    setIsFirstPeerVideoReady(true);
                }
            };

            // Listen for when the first peer video's metadata is loaded, indicating the stream is ready
            fistPeerVideoElement.addEventListener('loadedmetadata', handleFirstPeerVideoSrcObjectChange);

            // clean up first peer video screen
            return () => {
                fistPeerVideoElement.removeEventListener('loadedmetadata', handleFirstPeerVideoSrcObjectChange);
            };
        }
    }, [firstPeerVideoRef]);

    useEffect(() => {
        // Utility to handle setting video readiness state
        const handleVideoReady = (videoElement: HTMLVideoElement, setVideoReady: React.Dispatch<React.SetStateAction<boolean>>): void => {
            if (videoElement && videoElement.srcObject instanceof MediaStream && videoElement.srcObject.active) {
                setVideoReady(true);
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
                const handleMetadataLoaded = () => handleVideoReady(videoElement, setReady);
                videoElement.addEventListener('loadedmetadata', handleMetadataLoaded);

                return () => videoElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
            }
        });

        return () => {
            eventListeners.forEach(cleanup => cleanup && cleanup());
        };
    }, [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef]);

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                {/* my screen */}
                <div className={styles['screen']}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={videoRef}></video>
                        {
                            isMyWebcamLoading
                            &&
                            <div className={styles['video-loader-box']}>
                                <span className={styles['video-loader']}></span>
                            </div>
                        }
                    </div>
                    <h2 className={styles['video-text']}>내 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={isFirstPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={firstPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>상대방 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={isSecondPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={secondPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>상대방 화면</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={isThirdPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={thirdPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>상대방 화면</h2>
                </div>
            </div>
        </section>
    )
}

export default Screen;