import { useEffect, useState } from 'react';

interface Refs {
    // my side
    videoRef: React.RefObject<HTMLVideoElement>;
    streamRef: React.MutableRefObject<MediaStream | null>;
    // peer side
    firstPeerVideoRef: React.RefObject<HTMLVideoElement> | any;
    secondPeerVideoRef: React.RefObject<HTMLVideoElement> | any;
    thirdPeerVideoRef: React.RefObject<HTMLVideoElement> | any;
}

interface UseScreenProps {
    isOnlyMyVideoAvailable: boolean;
    setIsOnlyMyVideoAvailable: React.Dispatch<React.SetStateAction<boolean>>;
    refs: Refs;
}

export function useScreen({ isOnlyMyVideoAvailable, setIsOnlyMyVideoAvailable, refs }: UseScreenProps) {
    const { firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef } = refs;

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
                // check if peer video is ready and if my video is the only video
                const handleMetadataLoaded = () => { handleVideoReady(videoElement, setReady), setIsOnlyMyVideoAvailable(false) };
                videoElement.addEventListener('loadedmetadata', handleMetadataLoaded);

                return () => videoElement.removeEventListener('loadedmetadata', handleMetadataLoaded);
            }
        });

        return () => {
            eventListeners.forEach(cleanup => cleanup && cleanup());
        };
    }, [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef, setIsOnlyMyVideoAvailable]);

    // check if peer disconnects video. it checks srcObject is 'null'
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

    return {
        isFirstPeerVideoReady,
        isSecondPeerVideoReady,
        isThirdPeerVideoReady,
    };
}
