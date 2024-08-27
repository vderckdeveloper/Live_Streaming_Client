"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from 'socket.io-client';

// component
import Screen from "./screen";
import Sidebar from "./sidebar";
import SidebarMobile from "./sidebarmobile";
import Setting from "./setting";

// styles
import styles from '@/styles/stream/stream.module.css';

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
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

    // my video status
    const [isOnlyMyVideoAvailable, setIsOnlyMyVideoAvailable] = useState<boolean>(false);

    // option on/off
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isMicOn, setIsMicOn] = useState<boolean>(true);

    // video toggle
    const videoToggleReadyBtn = useRef<boolean>(true);
    const micToggleReadyBtn = useRef<boolean>(true);

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
    const availableVideoRefs = useMemo(() => {
        return [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef];
    }, [firstPeerVideoRef, secondPeerVideoRef, thirdPeerVideoRef]);

    // side bar ref
    const sidebarRef = useRef<HTMLElement>(null);

    // side bar mobile ref 
    const sidebarMobileRef = useRef<HTMLElement>(null);

    // side bar status
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

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

            // Reflect the new stream in peer connections
            peerConnections.current.forEach((pc) => {
                pc.getSenders().forEach((sender) => {
                    if (sender.track?.kind === 'video') {
                        const newVideoTrack = stream.getVideoTracks()[0];
                        if (newVideoTrack) sender.replaceTrack(newVideoTrack);
                    } else if (sender.track?.kind === 'audio') {
                        const newAudioTrack = stream.getAudioTracks()[0];
                        if (newAudioTrack) sender.replaceTrack(newAudioTrack);
                    }
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

    // toggle mic
    const onToggleMic = async () => {
        // guard clause
        if (!streamRef.current) return;

        // check if button is ready
        if (!micToggleReadyBtn.current) return;

        // return if screen is being shared
        if (isScreenSharing) {
            alert('화면 공유중에는 음소거 할수 없습니다.');
            return;
        }

        micToggleReadyBtn.current = false;

        // turn off mic
        if (isMicOn) {
            // toggle audio track
            const audioTracks = streamRef.current.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = false;
            });

            // Reflect the blank stream in peer connections
            peerConnections.current.forEach((pc) => {
                pc.getSenders().forEach((sender) => {
                    if (sender.track?.kind === 'audio') {
                        sender.replaceTrack(null); // Stop sending audio
                    }
                });
            });

            // button ready
            micToggleReadyBtn.current = true;

            // toggle mic
            setIsMicOn(false);
        } else {
            // toggle audio track
            const audioTracks = streamRef.current.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = true;
            });

            // start webcam stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            // Reflect the new stream in peer connections
            peerConnections.current.forEach((pc) => {
                pc.getSenders().forEach((sender) => {
                    if (sender.track?.kind === 'audio') {
                        const newAudioTrack = stream.getAudioTracks()[0];
                        if (newAudioTrack) sender.replaceTrack(newAudioTrack);
                    }
                });
            });

            // button ready
            micToggleReadyBtn.current = true;

            // toggle mic
            setIsMicOn(true);
        }
    };

    // toggle video
    const onToggleVideo = async () => {
        // guard clause
        if (!streamRef.current) return;

        // check if button is ready 
        if (!videoToggleReadyBtn.current) return;

        // return if screen is being shared
        if (isScreenSharing) {
            alert('화면 공유중에는 비디오를 끌수 없습니다.');
            return;
        }

        videoToggleReadyBtn.current = false;

        // turn off my screen
        if (isVideoOn) {
            // blank my video screen
            const videoTracks = streamRef.current.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = false;
            });

            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Create a blank video track using an off-screen canvas
            const canvas = document.createElement('canvas');
            canvas.width = 640; // Set desired width
            canvas.height = 480; // Set desired height
            const context = canvas.getContext('2d');

            if (context) {
                context.fillStyle = 'black';
                context.fillRect(0, 0, canvas.width, canvas.height);
            }

            const blankStream = canvas.captureStream();
            const videoTrack = blankStream.getVideoTracks()[0]; // Get the blank video track

            // local video stream
            if (videoRef.current) {
                videoRef.current.srcObject = blankStream;
            }

            // Reflect the blank stream in peer connections
            peerConnections.current.forEach((pc) => {
                pc.getSenders().forEach((sender) => {
                    if (sender.track?.kind === 'video') {
                        sender.replaceTrack(videoTrack);
                    }
                });
            });

            // button ready
            videoToggleReadyBtn.current = true;

            // video toggle
            setIsVideoOn(false);
            // turn on my screen
        } else {
            // toggle my video screen
            const videoTracks = streamRef.current.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = true;
            });

            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // start webcam stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // Reflect the new stream in peer connections
            peerConnections.current.forEach((pc) => {
                pc.getSenders().forEach((sender) => {
                    if (sender.track?.kind === 'video') {
                        const newVideoTrack = stream.getVideoTracks()[0];
                        if (newVideoTrack) sender.replaceTrack(newVideoTrack);
                    }
                });
            });

            // button ready
            videoToggleReadyBtn.current = true;

            // video toggle
            setIsVideoOn(true);
        }
    };

    // share my current screen
    const onShareMyCurrentScreen = async (): Promise<void> => {
        // return if mic is muted 
        if (!isMicOn) {
            alert('음소거 중에는 화면 공유하실수 없습니다.')
            return;
        }

        // return if video is muted 
        if (!isVideoOn) {
            alert('화면을 끈 상태에서 화면 공유 하실수 없습니다.');
            return;
        }

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

            // Reflect the new stream in peer connections
            peerConnections.current.forEach((pc) => {
                pc.getSenders().forEach((sender) => {
                    if (sender.track?.kind === 'video') {
                        const newVideoTrack = combinedStream.getVideoTracks()[0];
                        if (newVideoTrack) sender.replaceTrack(newVideoTrack);
                    } else if (sender.track?.kind === 'audio') {
                        const newAudioTrack = combinedStream.getAudioTracks()[0];
                        if (newAudioTrack) sender.replaceTrack(newAudioTrack);
                    }
                });
            });

            // reflect webcam streaming to the active stream
            streamRef.current = combinedStream;

            // set screen sharing on
            setIsScreenSharing(true);

            // restart webcam stream
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                onStartVideo();
                // set screen sharing off
                setIsScreenSharing(false);
            });


        } catch (error: unknown) {
            const recordingError = error as ScreenRecordingError;
            if (recordingError.name === 'NotAllowedError' || recordingError.name === 'NotFoundError') {
                // current screen off 
                setIsCurrentScreenOff(true);

                // start video
                onStartVideo();

                // set screen sharing off
                setIsScreenSharing(false);
                console.error(error);
            } else {
                console.error("Error starting screen recording: ", error);
            }
        }
    };

    // record my screen
    const onStartRecordingScreen = async (): Promise<void> => {
        // return if mic is muted 
        if (!isMicOn) {
            alert('음소거 중에는 녹화 하실수 없습니다.')
            return;
        }

        // return if video is muted 
        if (!isVideoOn) {
            alert('화면을 끈 상태에서 녹화 하실수 없습니다.');
            return;
        }

        try {
            // get video and audio streams
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' }, audio: true });
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

            // Add an event listener to handle when screen sharing is stopped
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                setIsScreenRecordingOff(true);
                recorder.stop(); // Stop the recorder when screen sharing ends
            });

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

    // create peer connection
    const createPeerConnectionForOfferMember = useCallback((offerId: string, answerId: string): RTCPeerConnection => {
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

        // instanitate rtc peer connection
        const pc = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });

        // ice candidate
        pc.onicecandidate = (event) => {
            /***
             * this is where the member who offers (the later joined member) sends the ice candidate list to the member who answers (the previously joined member) 
             * send ice candidate so that the member who answers can accpet ice candidate list
             */
            if (event.candidate && webSocketRef.current) {
                webSocketRef.current.emit('offercandidate', { candidate: event.candidate, offerId, answerId });
            }
        };

        // track peer connection
        pc.ontrack = (event) => {
            // Handle remote streams here
            console.log('event stream:', event.streams[0]);

            const stream = event.streams[0];

            // Check if the peer already has a video element assigned
            if (!assignedVideos.current.has(answerId)) {
                // Assign the next available video element
                const availableRef = availableVideoRefs.find(ref => !ref.current?.srcObject);
                if (availableRef) {
                    availableRef.current!.srcObject = stream;
                    assignedVideos.current.set(answerId, availableRef);
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

        // set peer connection
        peerConnections.current.set(answerId, pc);
        return pc;
    }, [availableVideoRefs]);

    // create peer connection
    const createPeerConnectionForAnswerMember = useCallback((offerId: string, answerId: string): RTCPeerConnection => {
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

        // instanitate rtc peer connection
        const pc = new RTCPeerConnection({
            iceServers: ICE_SERVERS
        });


        /***
         * this is where the member who answers (the previously joined member) sends the ice candidate list to the member who offers (the later joined member) 
         * send ice candidate so that the member who offers can accpet ice candidate list
         */
        pc.onicecandidate = (event) => {
            if (event.candidate && webSocketRef.current) {
                webSocketRef.current.emit('answercandidate', { candidate: event.candidate, offerId, answerId });
            }
        };

        // track peer connection
        pc.ontrack = (event) => {
            // remote stream
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

        // set peer connection
        peerConnections.current.set(offerId, pc);
        return pc;
    }, [availableVideoRefs]);

    const onSidebarMenuOpen = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.marginRight = '0px';
            setIsSidebarOpen(true);
        }
    }

    const onSidebarMenuClose = () => {
        if (sidebarRef.current) {
            sidebarRef.current.style.marginRight = '-405px';
            setIsSidebarOpen(false);
        }
    }

    const onSidebarMobileMenuOpen = () => {
        if (sidebarMobileRef.current) {
            sidebarMobileRef.current.style.transform = 'translateX(0)';
            setIsSidebarMobileOpen(true);
        }
    }

    const onSidebarMobileMenuClose = () => {
        if (sidebarMobileRef.current) {
            sidebarMobileRef.current.style.transform = 'translateX(100%)';
            setIsSidebarMobileOpen(false);
        }
    }

    // start video and signaling communication
    useEffect(() => {
        if (!pathName) return;

        const peerConnectionsCopy = peerConnections.current; // Store the reference in a variable

        async function startVideoAndSignalingCommunication() {
            // Stop the previous stream if it exists
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // start webcam stream
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            // peer connection
            stream.getTracks().forEach(track => {
                peerConnectionsCopy.forEach(pc => {
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

            // websocket signaling server connection
            webSocketRef.current = io(`${process.env.NEXT_PUBLIC_DIRECT_SOCKET_URL}/websocket/webrtc-signal`, {
                withCredentials: true,
                autoConnect: true,
                reconnectionAttempts: 10,
                reconnectionDelay: 3000,
                transports: ["websocket"],
            });

            // websocket - handle connection
            webSocketRef.current.on('connect', () => {
                console.log('websocket signaling server Connected!');
                webSocketRef.current?.emit('register', roomCode);
            });

            // websocket - room member count
            webSocketRef.current.on('roomMemberCount', (data) => {
                const roomMemberCount = data;
                if (roomMemberCount === 1) {
                    setIsOnlyMyVideoAvailable(true);
                }
            });

            // websocket - handle register
            webSocketRef.current.on('register', (data) => {
                /***
                 * only the later joined member 'register' (the previosuly joined member always answer, does not initiate the offer first)
                 * this is where the member who offers create the 'offer' (the later joined member)
                 * create offer and configure local SDP description
                 * send it to the member who answers and configure offer SDP in their setting (the later joined member)
                 */
                const { offerId, answerId } = data;

                if (!peerConnectionsCopy.has(answerId)) {
                    // create peer connection
                    const pc = createPeerConnectionForOfferMember(offerId, answerId);
                    if (streamRef.current) {
                        // add track
                        streamRef.current.getTracks().forEach(track => {
                            pc.addTrack(track, streamRef.current!);
                        });
                        // create offer and set local description
                        pc.createOffer().then(offer => {
                            pc.setLocalDescription(offer);
                            webSocketRef.current?.emit('offer', { offer, offerId, answerId });
                        });
                    }
                }
            });

            // websocket - handle offer candidate 
            webSocketRef.current.on('offercandidate', async (data) => {
                /***
                 * this is where the member who answers gets the 'ice candidate' from the member who offers (the previously joined member)
                 * sets ice candidate list
                 */
                const { candidate, offerId } = data;
                try {
                    const pc = peerConnectionsCopy.get(offerId);
                    if (pc) {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                } catch (error) {
                    console.error('Error adding received ICE candidate', error);
                }
            });

            // websocket - handle answer candidate 
            webSocketRef.current.on('answercandidate', async (data) => {
                /***
                 * this is where the member who offers gets the 'ice candidate' from the member who answers (the later joined member)
                 * sets ice candidate list
                 */
                const { candidate, answerId } = data;
                try {
                    const pc = peerConnectionsCopy.get(answerId);
                    if (pc) {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                } catch (error) {
                    console.error('Error adding received ICE candidate', error);
                }
            });

            // websocket - handle offer
            webSocketRef.current.on('offer', async (data) => {
                /***
                 * this is where the member who answers gets the 'offer' (the previously joined member)
                 * create offer and configure SDP description
                 * send it to the member who offered SDP first (the later joined member)
                 */
                const { offer, offerId, answerId } = data;

                if (offer && offer.sdp && offer.type) {
                    try {
                        // create peer connection
                        const pc = createPeerConnectionForAnswerMember(offerId, answerId);
                        // set remote description
                        await pc.setRemoteDescription(new RTCSessionDescription(offer));

                        // re-add the tracks
                        if (streamRef.current) {
                            streamRef.current.getTracks().forEach(track => {
                                pc.addTrack(track, streamRef.current!);
                            });
                        }

                        // create answer
                        const answer = await pc.createAnswer();
                        // set local description
                        await pc.setLocalDescription(answer);

                        // send answer
                        webSocketRef.current?.emit('answer', { answer, offerId, answerId });
                    } catch (error) {
                        console.error('Error setting remote description:', error);
                    }
                }
            });

            // websocket - handle answer
            webSocketRef.current.on('answer', async (data) => {
                /***
                 * this is where the member who offers gets the 'answer' (the later joined member)
                 * gets the answer and set SDP description
                 */
                const { answer, answerId } = data;

                const pc = peerConnectionsCopy.get(answerId);

                if (pc) {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            });

            // websocket - connection errors
            webSocketRef.current.on('connect_error', (error: unknown) => {
                console.error("Socket.IO connection error: ", error);
            });

            // websocket - room errors
            webSocketRef.current.on('room_error', (errorData) => {
                // status code
                const { statusCode } = errorData;

                // console error
                console.error('room Error:', errorData);

                // redirect if the room is full
                if (statusCode === 401) {
                    alert('채팅방입장시 부여받은 id가 유효하지 않습니다. 나중에 다시 시도해주세요');
                    window.location.href = '/';
                    // for other room error, show default warning message
                } else if (statusCode === 403) {
                    alert('채팅방 입장 인원은 최대 4명까지 입니다. 나중에 다시 시도해주세요.');
                    window.location.href = '/';
                } else {
                    alert('채팅방 입장에 실패하셨습니다. 나중에 다시 시도해주세요.');
                }
            });

            // webscoket - connection close
            webSocketRef.current.on('disconnect', () => {
                console.log("Socket.IO connection closed.");
            });

            // webscoket - disconnected member id
            webSocketRef.current.on('disconnectedMember', (data) => {
                const { disconnectedMemberId, roomMemberCount } = data;

                // make other peers video srcObject null
                const assignedVideoRef = assignedVideos.current.get(disconnectedMemberId);
                if (assignedVideoRef && assignedVideoRef.current) {
                    assignedVideoRef.current.srcObject = null;
                }

                // make my screen bigger if i'm the only one attending
                if (roomMemberCount === 1) {
                    setIsOnlyMyVideoAvailable(true);
                }
            });
        }

        // execute startVideoAndSignalingCommunication()
        startVideoAndSignalingCommunication();

        // clean up
        return () => {
            peerConnectionsCopy.forEach(pc => pc.close());
            peerConnectionsCopy.clear();
        };
    }, [pathName, createPeerConnectionForAnswerMember, createPeerConnectionForOfferMember]);

    return (
        <>
            <section className={styles['frame']}>
                <Screen
                    isMyWebcamLoading={isMyWebcamLoading}
                    isOnlyMyVideoAvailable={isOnlyMyVideoAvailable}
                    setIsOnlyMyVideoAvailable={setIsOnlyMyVideoAvailable}
                    refs={refs}
                />
                <Sidebar
                    ref={sidebarRef}
                />
                <SidebarMobile
                    ref={sidebarMobileRef}
                />
            </section>
            <Setting
                isCurrentScreenOff={isCurrentScreenOff}
                isScreenRecordingOff={isScreenRecordingOff}
                isMicOn={isMicOn}
                isVideoOn={isVideoOn}
                isSidebaropen={isSidebarOpen}
                isSidebarMobileOpen={isSidebarMobileOpen}
                onToggleVideo={onToggleVideo}
                onToggleMic={onToggleMic}
                onShareMyCurrentScreen={onShareMyCurrentScreen}
                onStartRecordingScreen={onStartRecordingScreen}
                onSidebarMenuOpen={onSidebarMenuOpen}
                onSidebarMenuClose={onSidebarMenuClose}
                onSidebarMobileMenuOpen={onSidebarMobileMenuOpen}
                onSidebarMobileMenuClose={onSidebarMobileMenuClose}
            />
        </>
    )
}

export default Stream;