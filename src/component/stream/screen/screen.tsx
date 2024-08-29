import { useScreen } from './useScreen';
import styles from '@/component/stream/screen/screen.module.css';

// refs interface
interface Refs {
    // my side
    videoRef: React.RefObject<HTMLVideoElement>;
    streamRef: React.MutableRefObject<MediaStream | null>;
    // peer side
    firstPeerVideoRef: React.RefObject<HTMLVideoElement> | any;
    secondPeerVideoRef: React.RefObject<HTMLVideoElement> | any;
    thirdPeerVideoRef: React.RefObject<HTMLVideoElement> | any;
}

// screen props interface
interface ScreenProps {
    isMyWebcamLoading: boolean;
    isOnlyMyVideoAvailable: boolean;
    setIsOnlyMyVideoAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    myAssignedId: string;
    refs: Refs;
}

const Screen = ({ isMyWebcamLoading, isOnlyMyVideoAvailable, setIsOnlyMyVideoAvailable, myAssignedId, refs }: ScreenProps) => {
    const { videoRef, firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef } = refs;

    const {
        isFirstPeerVideoReady,
        isSecondPeerVideoReady,
        isThirdPeerVideoReady,
        enlargedScreen,
        enlargedText,
        enlargedStream,
        onOpenEnlargedScreen,
        onCloseEnlargedScreen,
        onSetEnlargedText,
        onSetEnlargedScreenRef,
    } = useScreen({ setIsOnlyMyVideoAvailable, refs });

    return (
        <section className={styles['container']}>
            <div className={isOnlyMyVideoAvailable ? styles['my-only-screen-wrapper'] : styles['wrapper']}>
                {/* my screen */}
                <div className={isOnlyMyVideoAvailable ? styles['my-only-screen'] : styles['screen']}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={videoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{myAssignedId}</h2>
                    <button className={styles['video-enlarge-btn']} onClick={() => {
                        onOpenEnlargedScreen();
                        onSetEnlargedText(myAssignedId);
                        onSetEnlargedScreenRef(videoRef);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 21l-6-6m6 6v-4.8m0 4.8h-4.8" />
                            <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                            <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                            <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                        </svg>
                    </button>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isFirstPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={firstPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{firstPeerVideoRef.userId ? firstPeerVideoRef.userId : ''}</h2>
                    <button className={styles['video-enlarge-btn']} onClick={() => {
                        onOpenEnlargedScreen();
                        onSetEnlargedText(firstPeerVideoRef.userId);
                        onSetEnlargedScreenRef(firstPeerVideoRef);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 21l-6-6m6 6v-4.8m0 4.8h-4.8" />
                            <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                            <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                            <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                        </svg>
                    </button>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isSecondPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={secondPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{secondPeerVideoRef.userId ? secondPeerVideoRef.userId : ''}</h2>
                    <button className={styles['video-enlarge-btn']} onClick={() => {
                        onOpenEnlargedScreen();
                        onSetEnlargedText(secondPeerVideoRef.userId);
                        onSetEnlargedScreenRef(secondPeerVideoRef);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 21l-6-6m6 6v-4.8m0 4.8h-4.8" />
                            <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                            <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                            <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                        </svg>
                    </button>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isThirdPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={thirdPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{thirdPeerVideoRef.userId ? thirdPeerVideoRef.userId : ''}</h2>
                    <button className={styles['video-enlarge-btn']} onClick={() => {
                        onOpenEnlargedScreen();
                        onSetEnlargedText(thirdPeerVideoRef.userId);
                        onSetEnlargedScreenRef(thirdPeerVideoRef);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 21l-6-6m6 6v-4.8m0 4.8h-4.8" />
                            <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
                            <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
                            <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
                        </svg>
                    </button>
                </div>
                {/* enlarged screen */}
                {
                    enlargedScreen && enlargedStream
                    &&
                    <div className={styles['enlarged-screen']}>
                        <div className={styles['video-box']}>
                            <video
                                autoPlay
                                playsInline
                                ref={(el) => {
                                    if (el) el.srcObject = enlargedStream;
                                }}
                            >
                            </video>
                        </div>
                        <h2 className={styles['video-text']}>{enlargedText}</h2>
                        <button className={styles['video-minimize-btn']} onClick={() => {
                            onCloseEnlargedScreen();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="40" height="40" viewBox="0 0 24 24">
                                <path d="M9,3A1,1,0,0,0,8,4V6.59L3.71,2.29A1,1,0,0,0,2.29,3.71L6.59,8H4a1,1,0,0,0,0,2H8a2,2,0,0,0,2-2V4A1,1,0,0,0,9,3Z" />
                                <path d="M16,10h4a1,1,0,0,0,0-2H17.41l4.3-4.29a1,1,0,1,0-1.42-1.42L16,6.59V4a1,1,0,0,0-2,0V8A2,2,0,0,0,16,10Z" />
                                <path d="M8,14H4a1,1,0,0,0,0,2H6.59l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L8,17.41V20a1,1,0,0,0,2,0V16A2,2,0,0,0,8,14Z" />
                                <path d="M17.41,16H20a1,1,0,0,0,0-2H16a2,2,0,0,0-2,2v4a1,1,0,0,0,2,0V17.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                            </svg>
                        </button>
                    </div>
                }
            </div>
            {/* screen loading */}
            {
                isMyWebcamLoading
                &&
                <div className={styles['screen-loader-container']}>
                    <div className={styles['screen-loader-wrapper']}>
                        <span className={styles['screen-loader']}></span>
                    </div>
                </div>
            }
        </section>
    );
}

export default Screen;
