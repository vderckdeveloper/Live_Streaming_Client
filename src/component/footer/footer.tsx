import styles from '@/component/footer/footer.module.css';

function Footer() {

    return (
        <section className={styles.container}>
            <div className={styles.wrapper}>
                {/* foorter info */}
                <section>
                    <div>
                        <span>
                            개발자
                        </span>
                        <span>
                            이승민
                        </span>
                    </div>
                    <div>
                        <span>
                            이메일
                        </span>
                        <span>
                            vderckdeveloper@gmail.com
                        </span>
                    </div>
                </section>
                <p>Copyright © 2024 - Seungmin Lee. All right reserved.</p>
            </div>
        </section>
    )
}

export default Footer;