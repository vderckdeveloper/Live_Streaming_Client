import styles from '@/styles/stream/stream.module.css';

function Stream() {

    return (
        <section className={styles['container']}>
            <div className={styles['wrapper']}>
                {/* my screen */}
                <div className={styles['screen']}>
                    <div className={styles['video-box']} style={{backgroundColor: 'black'}}>
                        <video autoPlay playsInline muted></video>
                    </div>
                    <h2 className={styles['video-text']}>내 화면</h2>
                </div>
            </div>
        </section>
    )
}

export default Stream;