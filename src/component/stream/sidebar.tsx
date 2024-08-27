import React, { useState, useRef, useEffect, forwardRef } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import StudySupporterImage from '../../../public/image/test/240822_testBot_Ver2.0.png';

import styles from '@/styles/stream/sidebar.module.css';

// Define a type for messages
interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// format server time
const formatServerTimeDate = (dateFromServer: string) => {
    // Parse the date string
    const date = new Date(dateFromServer.replace(' ', 'T'));

    // Extract the date part and format it manually
    const month = date.getMonth() + 1; // Get month (zero-indexed)
    const day = date.getDate(); // Get day
    const formattedDate = `${month}월 ${day}일`;

    // Extract the time part and format it manually
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    const formattedTime = `${period} ${hours}:${minutes}:${seconds}`;

    // Combine the date and time parts
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
}

// eslint-disable-next-line react/display-name
const Sidebar = forwardRef((_: any, ref: any) => {

    // initial time stamp
    const [initialTimeStamp, setInitialTimeStamp] = useState<string>();

    // user input
    const [userInput, setUserInput] = useState<string>('');

    // message
    const [messages, setMessages] = useState<Message[]>([]);

    // ai loading dot
    const [aILoadingDot, setAILoadingDot] = useState<boolean>(false);

    // web socket ref
    const webSocketRef = useRef<Socket | null>(null);

    // scroll to bottom ref
    const scrollToBottomRef = useRef<HTMLDivElement>(null);

    // scroll to user input ref
    const scrollToUserInputRef = useRef<HTMLTextAreaElement>(null);

     // path name
     const pathName = usePathname();

    const onUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(event.target.value);
    };

    const onSend = (event: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (event.type === 'click' || (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Enter')) {
            event.preventDefault();

            // exit if user input does not exist
            if (!userInput || userInput === '' || userInput.trim().length === 0) {
                return;
            }

            // Add user's message
            const newUserMessage: Message = {
                role: 'user',
                content: userInput,
                timestamp: new Date().toLocaleTimeString(),
            };

            // set user message
            setMessages(prevMessages => [...prevMessages, newUserMessage]);

            // set user input to default
            setUserInput('');
        }
    };

    // set initial time stamp
    useEffect(() => {
        setInitialTimeStamp(new Date().toLocaleTimeString());
    }, []);

    // connect web socket
    useEffect(() => {
        if (!pathName) return;

         // room code from the path
         const roomCode = pathName.split('/')[2];
         if (!roomCode) return;

        // Connect to the WebSocket server
        webSocketRef.current = io(`${process.env.NEXT_PUBLIC_DIRECT_CHAT_URL}/websocket/chat`, {
            withCredentials: true,
            autoConnect: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 3000,
            transports: ["websocket"],
        });

        // Event listener for successful connection
        webSocketRef.current.on('connect', () => {
            console.log('WebSocket Chat Connected!');
            webSocketRef.current?.emit('register', roomCode);
        });

        // Event listener for receiving messages
        webSocketRef.current.on('newMessage', (message) => {
            const role = message.role;
            const type = message.type;
            const content = message.message;
            const timeStamp = message.register_date;

            const formattedTimeStamp = formatServerTimeDate(timeStamp);

            setMessages(prevMessages => [...prevMessages, {
                role: role,
                type: type,
                content: content,
                timestamp: formattedTimeStamp,
            }]);
        });

        // Event listener for isMessageWriting 
        webSocketRef.current.on('isMessageWriting', (messageWritingStatus) => {
            if (messageWritingStatus) {
                
            }
        });

        webSocketRef.current.on('auth_error', (error) => {
            console.error('Auth Error:', error);
            alert('유저 로그인 정보가 존재하지 않습니다. 로그인후 다시 시도해주세요.');
        });

        webSocketRef.current.on('register_error', (error) => {
            console.error('Register Error:', error);
            alert('채팅 등록 정보에 에러가 발생했습니다. 다시 시도해주세요.');
        });

        webSocketRef.current.on('room_error', (error) => {
            console.error('Register Error:', error);
            alert('채팅방 입장 관련 에러가 발생했습니다. 다시 시도해주세요.');
        });

        webSocketRef.current.on('connect_error', (error) => {
            console.error('Connection Error:', error);
            alert('채팅 연결에 실패했습니다. 커넥션을 확인후 다시 시도해주세요.');
        });

        // Clean up on component unmount
        return () => {
            webSocketRef.current?.disconnect();
        };
    }, [pathName]);

    return (
        <section className={styles['container']} ref={ref}>
            <div className={styles['wrapper']}>
                <article className={styles.aiDialogue}>
                    <div className={styles.aiTalk}>
                        <figure>
                            <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                        </figure>
                        <div>
                            <h2>채팅방에 입장하셨습니다!</h2>
                            <p>{initialTimeStamp}</p>
                        </div>
                        <h5>희망</h5>
                    </div>
                    {
                        messages.map((msg: any, index: any) => {
                            if (msg.role === 'assistant') {
                                return (
                                    <div key={index} className={styles.aiTalk}>
                                        <figure>
                                            <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                                        </figure>
                                        <div>
                                            <h2>{msg.content}</h2>
                                            <p>{msg.timestamp}</p>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className={styles.userTalk}>
                                    <p>{msg.content}</p>
                                </div>
                            );

                        })
                    }
                    {/* ai talk loading */}
                    {
                        aILoadingDot
                        &&
                        <div className={styles.aiTalk}>
                            <figure>
                                <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                            </figure>
                            <div>
                                <h2>
                                    <span className={styles.loadingDot}></span>
                                    <span className={styles.loadingDot}></span>
                                    <span className={styles.loadingDot}></span>
                                </h2>
                                <p>{new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    }
                    {/* bottom scroll target */}
                    <div ref={scrollToBottomRef} />
                </article>
                <div className={styles.aiInput}>
                    <textarea maxLength={100} value={userInput} onChange={onUserInput} placeholder='메세지를 입력해보세요' onKeyDown={onSend} ref={scrollToUserInputRef} />
                    <button type='button' onClick={onSend}>전송</button>
                </div>
            </div>
        </section>
    );
});

export default Sidebar;