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
                        onSetEnlargedScreenRef(videoRef, true);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <rect width="40" height="40" fill="white" fillOpacity="0.01" />
                            <path d="M6 6L16 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 41.8995L16 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42.0001 41.8995L32.1006 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M41.8995 6L32 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M33 6H42V15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42 33V42H33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 42H6V33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 15V6H15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
                        onSetEnlargedScreenRef(firstPeerVideoRef, false);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <rect width="40" height="40" fill="white" fillOpacity="0.01" />
                            <path d="M6 6L16 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 41.8995L16 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42.0001 41.8995L32.1006 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M41.8995 6L32 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M33 6H42V15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42 33V42H33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 42H6V33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 15V6H15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
                        onSetEnlargedScreenRef(secondPeerVideoRef, false);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <rect width="40" height="40" fill="white" fillOpacity="0.01" />
                            <path d="M6 6L16 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 41.8995L16 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42.0001 41.8995L32.1006 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M41.8995 6L32 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M33 6H42V15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42 33V42H33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 42H6V33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 15V6H15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
                        onSetEnlargedScreenRef(thirdPeerVideoRef, false);
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48" fill="none">
                            <rect width="40" height="40" fill="white" fillOpacity="0.01" />
                            <path d="M6 6L16 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 41.8995L16 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42.0001 41.8995L32.1006 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M41.8995 6L32 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M33 6H42V15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M42 33V42H33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 42H6V33" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 15V6H15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48" fill="none">
                                <rect width="40" height="40" fill="white" fillOpacity="0.01" />
                                <path d="M6 6L16 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6 41.8995L16 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M42.0001 41.8995L32.1006 32" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M41.8995 6L32 15.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M32 7V16H41" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 7V16H7" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 41V32H7" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M32 41V32H40.8995" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
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
