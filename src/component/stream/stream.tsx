"use client";
import { useState, useEffect, useRef } from "react";

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

     // ICE Server
     const ICE_SERVERS = [
        {
            urls: "stun:stun.l.google.com:19302",
        },
        {
            urls: "turn:YOUR_TURN_SERVER_URL",
            username: "YOUR_USERNAME",
            credential: "YOUR_CREDENTIAL",
        },
    ];

    const [isMyWebcamOn, setIsMyWebcamOn] = useState<boolean>(false);
    const [isCurrentScreenOff, setIsCurrentScreenOff] = useState<boolean>(true);
    const [isScreenRecordingOff, setIsScreenRecordingOff] = useState<boolean>(true);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);


    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenRecordingRef = useRef<MediaStream | null>(null);

    // objectify refs
    const refs: Refs = {
        videoRef,
        streamRef,
    }

    // start video
    const startVideo = async (): Promise<void> => {
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

            // webcam on status
            setIsMyWebcamOn(true);

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

            // reflect webcam streaming to the active stream
            streamRef.current = combinedStream;

            // restart webcam stream
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                startVideo();
            });
        } catch (error: unknown) {
            const recordingError = error as ScreenRecordingError;
            if (recordingError.name === 'NotAllowedError' || recordingError.name === 'NotFoundError') {
                // current screen off 
                setIsCurrentScreenOff(true);

                // start video
                startVideo();


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

    // start video first
    useEffect(() => {
        startVideo();
    }, []);

    return (
        <>
            <Screen
                isMyWebcamOn={isMyWebcamOn}
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