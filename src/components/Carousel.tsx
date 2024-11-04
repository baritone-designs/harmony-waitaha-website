'use client';

import Carousel from 'react-multi-carousel';
import Image from 'next/image';
import 'react-multi-carousel/lib/styles.css';

interface CustomCarouselProps {
    className: string;
}

export function CustomCarousel(
    { className }: CustomCarouselProps,
) {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        },
    };

    return (
        <Carousel
            swipeable
            draggable
            responsive={responsive} // optional, default to 1.}
            infinite
            autoPlay
            autoPlaySpeed={3000}
            transitionDuration={500}
            className={className}
        >
            <div>
                <Image src="/qa-wave.png" alt="picture" width={10000} height={10000} className="h-full w-full object-cover" draggable={false} />
            </div>
            <div>
                <Image src="/qa-photo.png" alt="picture" width={10000} height={10000} className="h-full w-full object-cover" draggable={false} />
            </div>
            <div>
                <Image src="/plainsmen-photo.jpg" alt="picture" width={10000} height={10000} className="h-full w-full object-cover" draggable={false} />
            </div>
            <div>
                <Image src="/defaultqt-photo.png" alt="picture" width={10000} height={10000} className="h-full w-full object-cover" draggable={false} />
            </div>
        </Carousel>
    );
}
