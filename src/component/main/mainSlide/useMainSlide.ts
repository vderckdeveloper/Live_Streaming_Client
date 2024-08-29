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
    const router = useRouter();
    const [swiper, setSwiper] = useState<SwiperClass>();

    const onStart = () => {
        const roomCode = generateRoomCode();
        router.push(`/stream/${roomCode}`);
    };

    const handlePrev = () => {
        swiper?.slidePrev();
    };

    const handleNext = () => {
        swiper?.slideNext();
    };

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
