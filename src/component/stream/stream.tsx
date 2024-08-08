"use client";
import { useState, useEffect, useRef } from "react";

import Screen from "./screen";
import Setting from "./setting";

interface Refs {
    videoRef: React.RefObject<HTMLVideoElement>;
    streamRef: React.MutableRefObject<MediaStream | null>;
}

function Stream() {

    const [isCurrentScreenOff, setIsCurrentScreenOff] = useState<boolean>(true);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const screenRecordingRef = useRef<MediaStream | null>(null);

    // objectify refs
    const refs: Refs = {
        videoRef,
        streamRef,
    }
    // start video
    const startVideo = async () => {
        try {
            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // start webcam stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCurrentScreenOff(true);
            }

            // reflect webcam streaming to the active stream
            streamRef.current = stream;
        } catch (err) {
            console.error("Error accessing the webcam and microphone: ", err);
        }
    };

    // share my current screen
    const onShareMyCurrentScreen = async () => {
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
                setIsCurrentScreenOff(false);
            }

            // reflect webcam streaming to the active stream
            streamRef.current = combinedStream;

            // restart webcam stream
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                startVideo();
            });
        } catch (err) {
            console.error("Error sharing the screen: ", err);
        }
    };

    // record my screen
    const onStartRecordingScreen = async () => {
        // get stream
        const stream = await navigator.mediaDevices.getDisplayMedia({video: true, audio: true});
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });


        const combinedStream = new MediaStream([
          ...stream.getVideoTracks(),
          ...audioStream.getAudioTracks()
        ]);
    
        const recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm' });
    
        // write the code that saves the recorded file 
        // continue on from here
      };

    // start video first
    useEffect(() => {
        startVideo();
    }, []);

    return (
        <>
            <Screen refs={refs} />
            <Setting isCurrentScreenOff={isCurrentScreenOff} onShareMyCurrentScreen={onShareMyCurrentScreen} refs={refs} />
        </>
    )
}

export default Stream;