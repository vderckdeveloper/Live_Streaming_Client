"use client";
import { useState } from "react";

// image
import groupVideoImage from '../../../public/image/main/240730_mainSlide_Image(1)_Ver1.0.png';
import recordVideoImage from '../../../public/image/main/240730_mainSlide_Image(2)_Ver1.0.png';

import Image, { StaticImageData } from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";


// Import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import "swiper/css/pagination";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import styles from '@/styles/main/mainSlide.module.css';

interface SlideListProps {
    imagePath: StaticImageData;
}

function SlideContent(props: SlideListProps) {

    const imagePath = props.imagePath;

    return (
        <section>
            <div className={styles['image-box']}>
                <Image src={imagePath} width={500} height={500} alt="그룹 비디오 이미지" quality={100} />
            </div>
        </section>
    );
}

function MainSlide() {

    // slide list
    const slideList: SlideListProps[] = [
        {
            imagePath: groupVideoImage,
        },
        {
            imagePath: recordVideoImage,
        },
        {
            imagePath: groupVideoImage,
        },
        {
            imagePath: recordVideoImage,
        },
        {
            imagePath: groupVideoImage,
        },
        {
            imagePath: recordVideoImage,
        },
    ];

    const [swiper, setSwiper] = useState<SwiperClass>();

    const handlePrev = () => {
        swiper?.slidePrev()
    }
    const handleNext = () => {
        swiper?.slideNext()
    }


    return (
        <main className={styles['container']}>
            <div className={styles['wrapper']}>
                <div className={styles['slide-frame']}>
                    {/* button box */}
                    <article className={`${styles['button-box']} ${styles['left-button-box']}`}>
                        <button onClick={handlePrev}>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"></path>
                            </svg>
                        </button>
                    </article>
                    {/* swiper */}
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
                        onSwiper={(e) => { setSwiper(e) }}
                        modules={[Autoplay, Navigation, Pagination]}
                        pagination={{ clickable: true }}
                        className={`${styles['main-slide']} main-slide`}
                    >
                        {
                            slideList.map((item, index) => {
                                const imagePath = item.imagePath;

                                return (
                                    <SwiperSlide key={index} >
                                        <SlideContent
                                            imagePath={imagePath}
                                        />
                                    </SwiperSlide>
                                );
                            })
                        }
                    </Swiper>
                    {/* navigation button */}
                    <article className={`${styles['button-box']} ${styles['right-button-box']}`}>
                        <button onClick={handleNext}>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
                            </svg>
                        </button>
                    </article>
                </div>
                <div className={styles['text-frame']}>
                    <div className={styles['text-box']}>
                        <h2>다자간 화상 통화 교육을 위한 최고의 선택!</h2>
                        <p>Edu Meet에서 많은 수의 인원에게 실시간 스트리밍을 시작하세요!</p>
                        <button>시작하기</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MainSlide;

