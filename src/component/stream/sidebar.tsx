import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import StudySupporterImage from '../../../public/image/test/240822_testBot_Ver2.0.png';

import styles from '@/styles/stream/sidebar.module.css';

// Define a type for messages
interface Message {
    role: 'me' | 'other';
    content: string;
    timestamp: string;
}

// Debounce function
const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void => {
    let debounceTimer: NodeJS.Timeout;
    return function (this: void, ...args: Parameters<T>) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
};

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

    // me loading dot
    const [meLoadingDot, setMeLoadingDot] = useState(false);

    // other loading dot
    const [hopeLoadingDot, setHopeLoadingDot] = useState<boolean>(false);
    const [happinessLoadingDot, setHappinessLoading] = useState<boolean>(false);
    const [peaceLoadingDot, setPeaceLoadingDot] = useState<boolean>(false);
    const [smileLoadingdot, setSmileLoadingDot] = useState<boolean>(false);

    // web socket ref
    const webSocketRef = useRef<Socket | null>(null);

    // scroll to bottom ref
    const scrollToBottomRef = useRef<HTMLDivElement>(null);

    // path name
    const pathName = usePathname();


    // Debounced functions for true and false statuses
    const debouncedEmit = useMemo(() => debounce((status: any) => {
        if (webSocketRef.current) {
            webSocketRef.current.emit('isMessageWriting', status);
            console.log(status);
        }
    }, 200), []);

    const onUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const userInput = event.target.value;
        setUserInput(userInput);

        if (!webSocketRef.current) return;

        // emit message writing status
        if (userInput && userInput !== '') {
            const messageWritingStatus = true;
            setMeLoadingDot(messageWritingStatus);
            debouncedEmit(messageWritingStatus);
        } else {
            const messageWritingStatus = false;
            setMeLoadingDot(messageWritingStatus);
            debouncedEmit(messageWritingStatus);
        }
    };

    const onSend = (event: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (event.type === 'click' || (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Enter')) {
            event.preventDefault();

            // exit if user input does not exist
            if (!userInput || userInput === '' || userInput.trim().length === 0) {
                return;
            }

            // Add user's message
            const myMessage: Message = {
                role: 'me',
                content: userInput,
                timestamp: new Date().toLocaleTimeString(),
            };

            // set user message
            setMessages(prevMessages => [...prevMessages, myMessage]);

            // Add sending message
            const otherMessage: Message = {
                role: 'other',
                content: userInput,
                timestamp: new Date().toLocaleTimeString(),
            };

            // emit message
            webSocketRef.current?.emit('newMessage', otherMessage);

            // emit message writing status
            webSocketRef.current?.emit('isMessageWriting', false);

            // set user input to default
            setUserInput('');

            // set me loading dot false
            setMeLoadingDot(false);
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
            const userId = message.userId;
            const role = message.role;
            const content = message.content;
            const timeStamp = message.register_date;

            const formattedTimeStamp = formatServerTimeDate(timeStamp);

            setMessages(prevMessages => [...prevMessages, {
                userId: userId,
                role: role,
                content: content,
                timestamp: formattedTimeStamp,
            }]);
        });

        // Event listener for isMessageWriting 
        webSocketRef.current.on('isMessageWriting', (messageWritingStatus) => {
            const userId = messageWritingStatus.userId;
            const isMessageWriting = messageWritingStatus.isMessageWriting;

            // reflect message writing status
            switch (userId) {
                case '희망':
                    setHopeLoadingDot(isMessageWriting);
                    break;
                case '행복':
                    setHappinessLoading(isMessageWriting);
                    break;
                case '평화':
                    setPeaceLoadingDot(isMessageWriting);
                    break;
                case '미소':
                    setSmileLoadingDot(isMessageWriting);
                    break;
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

    // scroll down to bottom whenever messages and creatorLoadingDot are added
    useEffect(() => {
        if (messages.length === 0) return;
        if (!scrollToBottomRef.current) return;

        scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages, meLoadingDot, hopeLoadingDot, happinessLoadingDot, peaceLoadingDot, smileLoadingdot]);

    return (
        <section className={styles['container']} ref={ref}>
            <div className={styles['wrapper']}>
                <article className={styles.otherDialogue}>
                    {
                        messages.map((msg: any, index: any) => {
                            if (msg.role === 'other') {
                                return (
                                    <div key={index} className={styles.otherTalk}>
                                        <figure>
                                            <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                                        </figure>
                                        <div>
                                            <h2>{msg.content}</h2>
                                            <p>{msg.timestamp}</p>
                                        </div>
                                        <h5>{msg.userId}</h5>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className={styles.meTalk}>
                                    <p>{msg.content}</p>
                                </div>
                            );

                        })
                    }
                    {/* other talk loading dot */}
                    {
                        hopeLoadingDot
                        &&
                        <div className={styles.otherTalk}>
                            <figure>
                                <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                            </figure>
                            <div>
                                <h2>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                </h2>
                                <p>{new Date().toLocaleTimeString()}</p>
                            </div>
                            <h5>희망</h5>
                        </div>
                    }
                    {
                        happinessLoadingDot
                        &&
                        <div className={`${styles['otherTalk']} ${styles['loadingOtherTalk']}`}>
                            <figure>
                                <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                            </figure>
                            <div>
                                <h2>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                </h2>
                                <p>{new Date().toLocaleTimeString()}</p>
                            </div>
                            <h5>행복</h5>
                        </div>
                    }
                    {
                        peaceLoadingDot
                        &&
                        <div className={`${styles['otherTalk']} ${styles['loadingOtherTalk']}`}>
                            <figure>
                                <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                            </figure>
                            <div>
                                <h2>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                </h2>
                                <p>{new Date().toLocaleTimeString()}</p>
                            </div>
                            <h5>평화</h5>
                        </div>
                    }
                    {
                        smileLoadingdot
                        &&
                        <div className={`${styles['otherTalk']} ${styles['loadingOtherTalk']}`}>
                            <figure>
                                <Image src={StudySupporterImage} width={26} height={26} alt='스터디 서포터 AI' />
                            </figure>
                            <div>
                                <h2>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                    <span className={styles['loadingDot']}></span>
                                </h2>
                                <p>{new Date().toLocaleTimeString()}</p>
                            </div>
                            <h5>미소</h5>
                        </div>
                    }
                    {/* me loading dot */}
                    {
                        meLoadingDot
                        &&
                        <div className={`${styles['otherTalk']} ${styles['loadingOtherTalk']}`}>
                            <span className={styles['loadingDot']}></span>
                            <span className={styles['loadingDot']}></span>
                            <span className={styles['loadingDot']}></span>
                        </div>
                    }
                    {/* bottom scroll target */}
                    <div ref={scrollToBottomRef} />
                </article>
                <div className={styles.aiInput}>
                    <textarea maxLength={100} value={userInput} onChange={onUserInput} placeholder='메세지를 입력해보세요' onKeyDown={onSend} />
                    <button type='button' onClick={onSend}>전송</button>
                </div>
            </div>
        </section>
    );
});

export default Sidebar;