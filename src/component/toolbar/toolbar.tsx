"use client";
import { useToolbar } from './useToolbar'; 
import Image from "next/image"
import EduMeetLogoImage from '../../../public/image/toolbar/240730_eduMeet_logo_Ver1.0.png';

// style
import styles from '@/component/toolbar/toolbar.module.css';

function Toolbar() {
    // current time
    const currentTime = useToolbar(); 
 
    return (
        <section className={styles['container']}>
            <nav className={styles['wrapper']}>
                {/* image box */}
                <div className={styles['imageBox']}>
                    <Image src={EduMeetLogoImage} width={567} height={189} alt='로고 이미지' />
                </div>
                {/* time box */}
                <div className={styles['timeBox']}>
                    <p>{currentTime}</p>
                </div>
            </nav>
        </section>
    )
}

export default Toolbar;