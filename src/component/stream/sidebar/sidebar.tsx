import React, { forwardRef } from 'react';
import { useSidebar, Message, LoadingMessage } from './useSidebar';
import Image from 'next/image';
import HopeIconImage from '../../../../public/image/sidebar/240828_HopeIcon_Ver1.0.png';
import HappinessIconImage from '../../../../public/image/sidebar/240828_HappinessIcon_Ver1.0.png';
import PeaceIconImage from '../../../../public/image/sidebar/240828_PeaceIcon_Ver1.0.png';
import SmileIconImage from '../../../../public/image/sidebar/240828_SmileIcon_Ver1.0.png';

import styles from '@/component/stream/sidebar/sidebar.module.css';

// side bar prop interface
interface SidebarProps {
    isSidebarOpen: boolean;
}

// assign icon image
const assignIconImage = (userId: string) => {
    switch (userId) {
        case '희망':
            return HopeIconImage;
        case '행복':
            return HappinessIconImage;
        case '평화':
            return PeaceIconImage;
        case '미소':
            return SmileIconImage;
        default:
            return HopeIconImage;
    }
};

// eslint-disable-next-line react/display-name
const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ isSidebarOpen }, ref) => {
    const {
        userInput,
        messages,
        meLoadingDot,
        loadingMessages,
        scrollToBottomRef,
        onUserInput,
        onSend,
    } = useSidebar(isSidebarOpen);

    return (
        <section className={styles['container']} ref={ref}>
            <div className={styles['wrapper']}>
                {/* other dialogue */}
                <article className={styles['otherDialogue']}>
                    {messages.map((msg: Message, index: number) => {
                        // user id
                        const userId = msg.userId;
                        // assign icon image
                        const IconImage = assignIconImage(userId || '');

                        if (msg.role === 'other') {
                            return (
                                <div key={index} className={styles['otherTalk']}>
                                    <figure>
                                        <Image src={IconImage} width={26} height={26} alt='멤버 사진' />
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
                            <div key={index} className={styles['meTalk']}>
                                <p>{msg.content}</p>
                            </div>
                        );
                    })}
                    {/* other loading dot */}
                    {loadingMessages.map((msg: LoadingMessage, index: number) => {
                        // user id
                        const userId = msg.userId;
                        // assign icon image
                        const IconImage = assignIconImage(userId);

                        return (
                            <div key={index} className={`${styles['otherTalk']} ${styles['loadingOtherTalk']}`}>
                                <figure>
                                    <Image src={IconImage} width={26} height={26} alt='멤버 사진' />
                                </figure>
                                <div>
                                    <h2>
                                        <span className={styles['loadingDot']}></span>
                                        <span className={styles['loadingDot']}></span>
                                        <span className={styles['loadingDot']}></span>
                                    </h2>
                                    <p>{msg.timestamp}</p>
                                </div>
                                <h5>{msg.userId}</h5>
                            </div>
                        );
                    })}
                    {/* me loading dot */}
                    {meLoadingDot && (
                        <div className={styles['meTalk']}>
                            <span className={styles['loadingDot']}></span>
                            <span className={styles['loadingDot']}></span>
                            <span className={styles['loadingDot']}></span>
                        </div>
                    )}
                    {/* bottom scroll target */}
                    <div ref={scrollToBottomRef} />
                </article>
                {/* me input */}
                <div className={styles.meInput}>
                    <textarea
                        maxLength={100}
                        value={userInput}
                        onChange={onUserInput}
                        placeholder='CTRL + ENTER 를 눌러주세요!'
                        onKeyDown={onSend}
                    />
                    <button type='button' onClick={onSend}>전송</button>
                </div>
            </div>
        </section>
    );
});

export default Sidebar;
