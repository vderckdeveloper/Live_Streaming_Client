import { useState } from "react";
import { useRouter } from 'next/navigation';
import { SwiperClass } from "swiper/react";
import { generateRoomCode } from "../../../../utils/utility";
import groupVideoImage from '../../../../public/image/main/240730_mainSlide_Image(1)_Ver1.0.png';
import recordVideoImage from '../../../../public/image/main/240730_mainSlide_Image(2)_Ver1.0.png';
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
        { imagePath: groupVideoImage },
        { imagePath: recordVideoImage },
        { imagePath: groupVideoImage },
        { imagePath: recordVideoImage },
        { imagePath: groupVideoImage },
        { imagePath: recordVideoImage },
    ];

    return {
        slideList,
        onStart,
        handlePrev,
        handleNext,
        setSwiper,
    };
}
