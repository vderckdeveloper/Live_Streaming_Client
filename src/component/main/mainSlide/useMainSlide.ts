import { useState } from "react";
import { useRouter } from 'next/navigation';
import { SwiperClass } from "swiper/react";
import { generateRoomCode } from "../../../../utils/utility";
import SlideImageOne from '../../../../public/image/main/240730_mainSlide_Image(1)_Ver1.0.png';
import SlideImageTwo from '../../../../public/image/main/240730_mainSlide_Image(2)_Ver1.0.png';
import SlideImageThree from '../../../../public/image/main/240730_mainSlide_Image(3)_Ver1.0.png';
import SlideImageFour from '../../../../public/image/main/240730_mainSlide_Image(4)_Ver1.0.png';
import SlideImageFive from '../../../../public/image/main/240730_mainSlide_Image(5)_Ver1.0.png';
import SlideImageSix from '../../../../public/image/main/240730_mainSlide_Image(6)_Ver1.0.png';
import { StaticImageData } from "next/image";

export interface SlideListProps {
    imagePath: StaticImageData;
}

export function useMainSlide() {
    // swiper
    const [swiper, setSwiper] = useState<SwiperClass>();

    // router
    const router = useRouter();

    // on start
    const onStart = () => {
        const roomCode = generateRoomCode();
        router.push(`/stream/${roomCode}`);
    };

    // handle prev slide
    const handlePrev = () => {
        swiper?.slidePrev();
    };

    // handle next slide
    const handleNext = () => {
        swiper?.slideNext();
    };

    // slide list
    const slideList: SlideListProps[] = [
        { imagePath: SlideImageOne },
        { imagePath: SlideImageTwo },
        { imagePath: SlideImageThree },
        { imagePath: SlideImageFour },
        { imagePath: SlideImageFive },
        { imagePath: SlideImageSix },
    ];

    return {
        slideList,
        onStart,
        handlePrev,
        handleNext,
        setSwiper,
    };
}
