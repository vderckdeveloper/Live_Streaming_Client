"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from 'socket.io-client';

import Screen from "./screen";
import Setting from "./setting";

interface Refs {
    // my side
    videoRef: React.RefObject<HTMLVideoElement>;
    streamRef: React.MutableRefObject<MediaStream | null>;
    // peer side
    firstPeerVideoRef: React.RefObject<HTMLVideoElement>;
    secondPeerVideoRef: React.RefObject<HTMLVideoElement>;
    thirdPeerVideoRef: React.RefObject<HTMLVideoElement>;
}

interface ScreenRecordingError {
    name: 'NotAllowedError' | 'NotFoundError' | 'SecurityError' | 'AbortError' | 'NotReadableError' | 'OverconstrainedError' | 'TypeError' | string;
    message?: string;
};

function Stream() {

    // my side
    const [isMyWebcamLoading, setIsMyWebcamloading] = useState<boolean>(true);
    const [isCurrentScreenOff, setIsCurrentScreenOff] = useState<boolean>(true);
    const [isScreenRecordingOff, setIsScreenRecordingOff] = useState<boolean>(true);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

    // peer side
    const [hasPeerNotJoinedYet, SetHasPeerNotJoinedYet] = useState<boolean>(true);

    // web socket ref
    const webSocketRef = useRef<Socket | null>(null);

    // peer connection
    const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

    // my side ref
    const videoRef = useRef<HTMLVideoElement>(null); // local video stream
    const streamRef = useRef<MediaStream | null>(null);
    const screenRecordingRef = useRef<MediaStream | null>(null);

    // peer video 
    const firstPeerVideoRef = useRef<HTMLVideoElement>(null);
    const secondPeerVideoRef = useRef<HTMLVideoElement>(null);
    const thirdPeerVideoRef = useRef<HTMLVideoElement>(null);

    // New state to keep track of assigned peer video elements
    const assignedVideos = useRef<Map<string, React.RefObject<HTMLVideoElement>>>(new Map());
    const availableVideoRefs = [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef];

    // objectify refs
    const refs: Refs = {
        videoRef,
        streamRef,
        firstPeerVideoRef,
        secondPeerVideoRef,
        thirdPeerVideoRef,
    }

    // path name
    const pathName = usePathname();

    // start video
    const onStartVideo = async (): Promise<void> => {
        try {
            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // start webcam stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // current status off status
                setIsCurrentScreenOff(true);
            }

            // peer connection
            stream.getTracks().forEach(track => {
                peerConnections.current.forEach(pc => {
                    pc.addTrack(track, stream);
                });
            });

            // webcam loading status
            setIsMyWebcamloading(false);

            // reflect webcam streaming to the active stream
            streamRef.current = stream;
        } catch (err) {
            console.error("Error accessing the webcam and microphone: ", err);
        }
    };

    // share my current screen
    const onShareMyCurrentScreen = async (): Promise<void> => {
        try {
            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Start the screen sharing stream
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);

            if (videoRef.current) {
                videoRef.current.srcObject = combinedStream;
                // current screen on
                setIsCurrentScreenOff(false);
            }

            // peer connection
            combinedStream.getTracks().forEach(track => {
                peerConnections.current.forEach(pc => {
                    pc.addTrack(track, combinedStream);
                });
            });
            // reflect webcam streaming to the active stream
            streamRef.current = combinedStream;

            // restart webcam stream
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                onStartVideo();
            });
        } catch (error: unknown) {
            const recordingError = error as ScreenRecordingError;
            if (recordingError.name === 'NotAllowedError' || recordingError.name === 'NotFoundError') {
                // current screen off 
                setIsCurrentScreenOff(true);

                // start video
                onStartVideo();


                console.error(error);
            } else {
                console.error("Error starting screen recording: ", error);
            }
        }
    };

    // record my screen
    const onStartRecordingScreen = async (): Promise<void> => {
        try {
            // get video and audio streams
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // combine streams
            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);

            // local variable to store chunks
            let recordedChunks: Blob[] = [];

            // create media recorder
            const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'screen-recording.webm';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                // Optionally clear the local array if needed later
                recordedChunks = [];
            };

            // set the recorder to state if needed
            setMediaRecorder(recorder);

            // recording status
            setIsScreenRecordingOff(false);

            // start recording
            recorder.start();

            // store the stream reference for stopping later
            if (screenRecordingRef.current) {
                screenRecordingRef.current = combinedStream;
            }
        } catch (error: unknown) {
            const recordingError = error as ScreenRecordingError;
            if (recordingError.name === 'NotAllowedError' || recordingError.name === 'NotFoundError') {
                setIsScreenRecordingOff(true);
                console.error(error);
            } else {
                console.error("Error starting screen recording: ", error);
            }
        }
    };

    // stop recording screen
    const onStopRecordingScreen = (): void => {
        if (mediaRecorder) {
            // stop recording
            mediaRecorder.stop();

            // recording status
            setIsScreenRecordingOff(true);

            if (screenRecordingRef.current) {
                screenRecordingRef.current.getTracks().forEach(track => track.stop());
                screenRecordingRef.current = null;
            }
        }
    };


    // create peer connection
    const createPeerConnection = (peerId: string): RTCPeerConnection => {
        // ice server
        const ICE_SERVERS = [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
            {
                urls: `${process.env.NEXT_PUBLIC_COTURN_SERVER_URL}`,
                username: process.env.NEXT_PUBLIC_COTURN_SERVER_USERNAME,
                credential: process.env.NEXT_PUBLIC_COTURN_SERVER_CREDENTIAL,
            },
        ];

        const pc = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });

        // ice candidate
        pc.onicecandidate = (event) => {
            if (event.candidate && webSocketRef.current) {
                webSocketRef.current.emit('candidate', { candidate: event.candidate, peerId });
            }
        };

        // track peer connection
        pc.ontrack = (event) => {
            // Handle remote streams here
            console.log('event stream:', event.streams[0]);

            const stream = event.streams[0];

            // Check if the peer already has a video element assigned
            if (!assignedVideos.current.has(peerId)) {
                // Assign the next available video element
                const availableRef = availableVideoRefs.find(ref => !ref.current?.srcObject);
                if (availableRef) {
                    availableRef.current!.srcObject = stream;
                    assignedVideos.current.set(peerId, availableRef);
                } else {
                    console.error("No available video elements for new participant.");
                }
            }
        };

        // Monitor ICE connection state
        pc.oniceconnectionstatechange = () => {
            console.log('ice connection state', pc.iceConnectionState);
            // You can add additional handling here, e.g., notify the user if the state is 'failed'
            if (pc.iceConnectionState === 'failed') {
                // Handle reconnection or other logic
                console.error('ice connection failed!');
            }
        };

        peerConnections.current.set(peerId, pc);
        return pc;
    };

    // create peer connection
    const createPeerConnectionForTheAnswerer = (offerId: string, peerId: string): RTCPeerConnection => {
        // ice server
        const ICE_SERVERS = [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
            {
                urls: `${process.env.NEXT_PUBLIC_COTURN_SERVER_URL}`,
                username: process.env.NEXT_PUBLIC_COTURN_SERVER_USERNAME,
                credential: process.env.NEXT_PUBLIC_COTURN_SERVER_CREDENTIAL,
            },
        ];

        const pc = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });

        // ice candidate
        pc.onicecandidate = (event) => {
            if (event.candidate && webSocketRef.current) {
                webSocketRef.current.emit('candidate', { candidate: event.candidate, peerId });
            }
        };

        // track peer connection
        pc.ontrack = (event) => {
            // Handle remote streams here
            console.log('event stream:', event.streams[0]);

            const stream = event.streams[0];

            // Check if the peer already has a video element assigned
            if (!assignedVideos.current.has(offerId)) {
                // Assign the next available video element
                const availableRef = availableVideoRefs.find(ref => !ref.current?.srcObject);
                if (availableRef) {
                    availableRef.current!.srcObject = stream;
                    assignedVideos.current.set(offerId, availableRef);
                } else {
                    console.error("No available video elements for new participant.");
                }
            }
        };

        // Monitor ICE connection state
        pc.oniceconnectionstatechange = () => {
            console.log('ice connection state', pc.iceConnectionState);
            // You can add additional handling here, e.g., notify the user if the state is 'failed'
            if (pc.iceConnectionState === 'failed') {
                // Handle reconnection or other logic
                console.error('ice connection failed!');
            }
        };

        peerConnections.current.set(peerId, pc);
        return pc;
    };

    // signaling server
    useEffect(() => {
        async function startVideoAndSignaling() {
            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // start webcam stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // current status off status
                setIsCurrentScreenOff(true);
            }

            // peer connection
            stream.getTracks().forEach(track => {
                peerConnections.current.forEach(pc => {
                    pc.addTrack(track, stream);
                });
            });

            // webcam loading status
            setIsMyWebcamloading(false);

            // reflect webcam streaming to the active stream
            streamRef.current = stream;

            // room code from the path
            const roomCode = pathName.split('/')[2];
            if (!roomCode) return;

            // signaling server connection
            webSocketRef.current = io(`${process.env.NEXT_PUBLIC_DIRECT_SOCKET_URL}/websocket/webrtc-signal`, {
                withCredentials: true,
                autoConnect: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 3000,
                transports: ["websocket"],
            });

            webSocketRef.current.on('connect', () => {
                console.log('websocket signaling server Connected!');
                webSocketRef.current?.emit('register', roomCode);
            });

            webSocketRef.current.on('register', (data) => {
                const { offerId, peerId } = data;

                if (!peerConnections.current.has(peerId)) {
                    const pc = createPeerConnection(peerId);
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach(track => {
                            pc.addTrack(track, streamRef.current!);
                        });
                        pc.createOffer().then(offer => {
                            pc.setLocalDescription(offer);
                            webSocketRef.current?.emit('offer', { offer, offerId, peerId });
                        });
                    }
                }
            });

            // Handle incoming ICE candidates from other peers
            webSocketRef.current.on('candidate', async (data) => {
                const { candidate, peerId } = data;
                try {
                    const pc = peerConnections.current.get(peerId);
                    if (pc) {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log('Added ICE candidate:', candidate);
                    }
                } catch (error) {
                    console.error('Error adding received ICE candidate', error);
                }
            });

            webSocketRef.current.on('offer', async (data) => {
                const { offer, offerId, peerId } = data;
                
                if (offer && offer.sdp && offer.type) {
                    try {
                        const pc = createPeerConnectionForTheAnswerer(offerId, peerId);
                        await pc.setRemoteDescription(new RTCSessionDescription(offer));

                        // Re-add the tracks just in case (optional, depending on your flow)
                        if (streamRef.current) {
                            streamRef.current.getTracks().forEach(track => {
                                pc.addTrack(track, streamRef.current!);
                            });
                        }

                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);

                        // send answer
                        webSocketRef.current?.emit('answer', { answer, offerId, peerId });
                    } catch (error) {
                        console.error('Error setting remote description:', error);
                    }
                }
            });

            webSocketRef.current.on('answer', async (data) => {
                const { answer, peerId } = data;

                const pc = peerConnections.current.get(peerId);

                if (pc) {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            });

            // Handle connection errors
            webSocketRef.current.on('connect_error', (error: unknown) => {
                console.error("Socket.IO connection error: ", error);
            });

            // Handle connection close
            webSocketRef.current.on('disconnect', () => {
                console.log("Socket.IO connection closed.");
            });
        }

        startVideoAndSignaling();

        return () => {
            peerConnections.current.forEach(pc => pc.close());
            peerConnections.current.clear();
        };
    }, []);

    return (
        <>
            <Screen
                isMyWebcamLoading={isMyWebcamLoading}
                hasPeerNotJoinedYet={hasPeerNotJoinedYet}
                refs={refs}
            />
            <Setting
                isCurrentScreenOff={isCurrentScreenOff}
                isScreenRecordingOff={isScreenRecordingOff}
                onShareMyCurrentScreen={onShareMyCurrentScreen}
                onStartRecordingScreen={onStartRecordingScreen}
                onStopRecordingScreen={onStopRecordingScreen}
                refs={refs}
            />
        </>
    )
}

export default Stream;