"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import 'swiper/css/navigation';
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import styles from '@/component/main/mainSlide/mainSlide.module.css';
import { useMainSlide, SlideListProps } from './useMainSlide';

// slide content props
interface SlideContentProps {
    imagePath: SlideListProps['imagePath'];
}

// slide content
function SlideContent({ imagePath }: SlideContentProps) {
    return (
        <section>
            <div className={styles['image-box']}>
                <Image src={imagePath} width={500} height={500} alt="그룹 비디오 이미지" quality={100} />
            </div>
        </section>
    );
}

// main slide
function MainSlide() {
    const { slideList, onStart, handlePrev, handleNext, setSwiper } = useMainSlide();

    return (
        <main className={styles['container']}>
            <div className={styles['wrapper']}>
                {/* slide frame */}
                <div className={styles['slide-frame']}>
                    {/* hanlde prev slide btn*/}
                    <article className={`${styles['button-box']} ${styles['left-button-box']}`}>
                        <button onClick={handlePrev}>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"></path>
                            </svg>
                        </button>
                    </article>
                    {/* main slide */}
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                            },
                        }}
                        onSwiper={setSwiper}
                        modules={[Autoplay, Navigation, Pagination]}
                        pagination={{ clickable: true }}
                        className={`${styles['main-slide']} main-slide`}
                    >
                        {slideList.map((item, index) => (
                            <SwiperSlide key={index}>
                                <SlideContent imagePath={item.imagePath} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {/* handle next slide btn */}
                    <article className={`${styles['button-box']} ${styles['right-button-box']}`}>
                        <button onClick={handleNext}>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
                            </svg>
                        </button>
                    </article>
                </div>
                {/* text frame */}
                <div className={styles['text-frame']}>
                    <div className={styles['text-box']}>
                        <h2>다자간 화상 통화 교육을 위한 최고의 선택!</h2>
                        <p>Edu Meet에서 많은 수의 인원에게 실시간 스트리밍을 시작하세요!</p>
                        <button onClick={onStart}>시작하기</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MainSlide;
