import React, { useState, useRef, useEffect, forwardRef, RefObject } from 'react';
import Image from 'next/image';
import StudySupporterImage from '../../../public/image/test/240822_testBot_Ver2.0.png';

import styles from '@/styles/stream/sidebarmobile.module.css';

// Define a type for messages
interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// eslint-disable-next-line react/display-name
const SidebarMobile = forwardRef((_: any, ref: any) => {

    // initial time stamp
    const [initialTimeStamp, setInitialTimeStamp] = useState<string>();

    // user input
    const [userInput, setUserInput] = useState<string>('');

    // message
    const [messages, setMessages] = useState<Message[]>([]);

    // ai loading dot
    const [aILoadingDot, setAILoadingDot] = useState<boolean>(false);

    // response waiting
    const responseWaiting = useRef<boolean>(false);

    // scroll to bottom ref
    const scrollToBottomRef = useRef<HTMLDivElement>(null);

    // scroll to user input ref
    const scrollToUserInputRef = useRef<HTMLTextAreaElement>(null);

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

            // exit if response waiting is true
            if (responseWaiting.current) {
                return;
            }

            // Add user's message
            const newUserMessage: Message = {
                role: 'user',
                content: userInput,
                timestamp: new Date().toLocaleTimeString(),
            };

            setMessages(prevMessages => [...prevMessages, newUserMessage]);
        }
    };

    // set initial time stamp
    useEffect(() => {
        setInitialTimeStamp(new Date().toLocaleTimeString());
    }, []);

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

export default SidebarMobile;