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
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isFirstPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={firstPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{firstPeerVideoRef.userId ? firstPeerVideoRef.userId : ''}</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isSecondPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={secondPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{secondPeerVideoRef.userId ? secondPeerVideoRef.userId : ''}</h2>
                </div>
                {/* other screen */}
                <div className={styles['screen']} style={!isOnlyMyVideoAvailable && isThirdPeerVideoReady ? { display: 'flex' } : { display: 'none' }}>
                    <div className={styles['video-box']}>
                        <video autoPlay playsInline ref={thirdPeerVideoRef}></video>
                    </div>
                    <h2 className={styles['video-text']}>{thirdPeerVideoRef.userId ? thirdPeerVideoRef.userId : ''}</h2>
                </div>
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
