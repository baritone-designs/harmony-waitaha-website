'use client';

import Carousel from 'react-multi-carousel';
import MediaRenderer from './MediaRenderer';

interface MediaCarouselProps {
    className: string;
    mediaUrls: string[];
}

export function MediaCarousel(
    { className, mediaUrls }: MediaCarouselProps,
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
            {mediaUrls.map((url) => <MediaRenderer url={url} className="size-full" />)}
        </Carousel>
    );
}
