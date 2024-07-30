import Image from "next/image"
import EduMeetLogoImage from '../../../public/image/toolbar/240730_eduMeet_logo_Ver1.0.png';

function Toolbar() {

    return (
        <section>
            <nav>
                <Image src={EduMeetLogoImage} width={567} height={189} alt='로고 이미지' />
            </nav>
        </section>
    )
}

export default Toolbar;