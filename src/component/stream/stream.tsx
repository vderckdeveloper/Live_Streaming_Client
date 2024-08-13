"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from 'socket.io-client';

import Screen from "./screen";
import Setting from "./setting";

interface Refs {
    videoRef: React.RefObject<HTMLVideoElement>;
    streamRef: React.MutableRefObject<MediaStream | null>;
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

    // web socket ref
    const webSocketRef = useRef<Socket | null>(null);

    // peer connection
    const peerConnection = useRef<RTCPeerConnection | null>(null);

    // my side ref
    const videoRef = useRef<HTMLVideoElement>(null); // local video stream
    const streamRef = useRef<MediaStream | null>(null);
    const screenRecordingRef = useRef<MediaStream | null>(null);

    // objectify refs
    const refs: Refs = {
        videoRef,
        streamRef,
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
                peerConnection.current?.addTrack(track, stream);
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
                peerConnection.current?.addTrack(track, combinedStream);
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

    // start video streaming after the component is mounted
    useEffect(() => {
        onStartVideo();
    }, []);

    // signaling server
    useEffect(() => {
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

        webSocketRef.current.on('candidate', async (candidate) => {
            if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        webSocketRef.current.on('offer', async (offer) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);

                // send answer
                webSocketRef.current?.emit('answer', answer);
            }
        });

        webSocketRef.current.on('answer', async (answer) => {
            if (peerConnection.current) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
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
    }, []);

    // peer connection
    useEffect(() => {
        // ICE SERVER
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

        peerConnection.current = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate && webSocketRef.current) {
                // Emit the candidate to the server
                webSocketRef.current.emit('candidate', event.candidate);
            }
        };

        // continue on from the code below
        peerConnection.current.ontrack = (event) => {
            if (event.streams && event.streams[0]) {
                console.log('remote video stream', event.streams[0]);
            }
        };

        // Monitor ICE gathering state
        peerConnection.current.addEventListener('icegatheringstatechange', () => {
            console.log('ICE Gathering State:', peerConnection.current?.iceGatheringState);
        });

        // Start video and add tracks to the peer connection
        const startVideoAndAddTracks = async () => {
            try {
                // Get user media (video and audio)
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                // Add each track to the peer connection
                stream.getTracks().forEach(track => {
                    peerConnection.current?.addTrack(track, stream);
                });

                // Create an offer
                const offer = await peerConnection.current?.createOffer();

                // Set the local description with the created offer
                if (offer) {
                    await peerConnection.current?.setLocalDescription(offer);
                    console.log('Local description set, ICE gathering should start.');

                    // Send the offer to the signaling server
                    if (webSocketRef.current) {
                        webSocketRef.current.emit('offer', offer);
                    }
                }
            } catch (error) {
                console.error('Error during WebRTC setup:', error);
            }
        };
        startVideoAndAddTracks();

        return () => {
            peerConnection.current?.close();
        };
    }, []);

    return (
        <>
            <Screen
                isMyWebcamLoading={isMyWebcamLoading}
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