import { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

export interface Message {
    userId?: string;
    role: 'me' | 'other';
    content: string;
    timestamp: string;
}

export interface LoadingMessage {
    userId: string;
    isMessageWriting: boolean;
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

    // format time
    const formattedTime = `${period} ${hours}:${minutes}:${seconds}`;

    // Combine the date and time parts
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
};

export const useSidebar = (isSidebarOpen: boolean) => {
    // user input
    const [userInput, setUserInput] = useState<string>('');

    // message
    const [messages, setMessages] = useState<Message[]>([]);

    // me loading dot
    const [meLoadingDot, setMeLoadingDot] = useState(false);

    // loading message
    const [loadingMessages, setLoadingMessages] = useState<LoadingMessage[]>([]);

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
        if (event.type === 'click' || (event.type === 'keydown' && (event as React.KeyboardEvent).key === 'Enter' && (event as React.KeyboardEvent).ctrlKey)) {
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

            // emit message writing status
            webSocketRef.current?.emit('isMessageWriting', false);

            // emit message
            webSocketRef.current?.emit('newMessage', otherMessage);

            // set user input to default
            setUserInput('');

            // set me loading dot false
            setMeLoadingDot(false);
        }
    };

    useEffect(() => {
        // return if pathname does not exist
        if (!pathName) return;

        // get room code
        const roomCode = pathName.split('/')[2];
        if (!roomCode) return;

        // websocket - initialization
        webSocketRef.current = io(`${process.env.NEXT_PUBLIC_DIRECT_CHAT_URL}/websocket/chat`, {
            withCredentials: true,
            autoConnect: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 3000,
            transports: ["websocket"],
        });

        // websocket - connect
        webSocketRef.current.on('connect', () => {
            console.log('WebSocket Chat Connected!');
            webSocketRef.current?.emit('register', roomCode);
        });

        // websocket - new message
        webSocketRef.current.on('newMessage', (message) => {
            const userId = message.userId;
            const role = message.role;
            const content = message.content;
            const timeStamp = message.register_date;
            const formattedTimeStamp = formatServerTimeDate(timeStamp);

            // set messages
            setMessages(prevMessages => [...prevMessages, { userId, role, content, timestamp: formattedTimeStamp }]);
        });

        // websocket - is message writing
        webSocketRef.current.on('isMessageWriting', (messageWritingStatus) => {
            const userId = messageWritingStatus.userId;
            const isMessageWriting = messageWritingStatus.isMessageWriting;
            const timeStamp = messageWritingStatus.register_date;
            const formattedTimeStamp = formatServerTimeDate(timeStamp);

            // set loading messages
            setLoadingMessages(prevMessages => {
                const messageExists = prevMessages.some(message => message.userId === userId);
                if (isMessageWriting && !messageExists) {
                    return [...prevMessages, { userId, isMessageWriting, timestamp: formattedTimeStamp }];
                } else if (!isMessageWriting) {
                    return prevMessages.filter(message => message.userId !== userId);
                }
                return prevMessages;
            });
        });

        // websocket - error handling
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

        return () => {
            webSocketRef.current?.disconnect();
        };
    }, [pathName]);

    useEffect(() => {
        if (!isSidebarOpen) return;
        if (messages.length === 0) return;
        if (!scrollToBottomRef.current) return;

        scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [isSidebarOpen, messages, meLoadingDot, loadingMessages]);

    return {
        userInput,
        messages,
        meLoadingDot,
        loadingMessages,
        scrollToBottomRef,
        onUserInput,
        onSend,
    };
};
