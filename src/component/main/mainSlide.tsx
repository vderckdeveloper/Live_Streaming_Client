"use client";
import { useState } from "react";

// image
import groupVideoImage from '../../../public/image/main/240730_mainSlide_Image(1)_Ver1.0.png';

import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide, SwiperClass } from "swiper/react";


// Import Swiper styles
import "swiper/css";
import 'swiper/css/navigation';
import "swiper/css/pagination";

// import required modules
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import styles from '@/styles/main/mainSlide.module.css';

function SlideContent() {
    return (
        <section>
            <div className={styles['imageBox']}>
                <Image src={groupVideoImage} width={500} height={500} alt="그룹 비디오 이미지" quality={100} />
            </div>
        </section>
    );
}

function MainSlide() {

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
                {/* swiper */}
                <Swiper
                    slidesPerView={5}
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
                    pagination={true}
                    className={styles['mainSlide']}
                >
                    <SwiperSlide>
                        <SlideContent />
                    </SwiperSlide>
                    <SwiperSlide>
                        <SlideContent />
                    </SwiperSlide>
                    <SwiperSlide>
                        <SlideContent />
                    </SwiperSlide>
                    <SwiperSlide>
                        <SlideContent />
                    </SwiperSlide>
                    <SwiperSlide>
                        <SlideContent />
                    </SwiperSlide>
                </Swiper>
                {/* navigation button */}
                <article>
                    <button onClick={handlePrev}>이전</button>
                    <button onClick={handleNext}>다음</button>
                </article>
            </div>
        </main>
    );
}

export default MainSlide;

