import { IMAGE_FILE_ENDINGS, VIDEO_FILE_ENDINGS } from '@/common/constants';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface MediaRendererProps {
    url: string;
    className: string;

    videoOveride?: ReactNode;
    imageOveride?: ReactNode;
}

/**
 * Handles the rendering of either images or videos from a URL
 *
 * The type of rendering is infered from the file ending on the URL, the provided URL must have this file ending or the component may not work
 */
export default function MediaRenderer({ url, className, imageOveride, videoOveride }: MediaRendererProps) {
    const isVideo = VIDEO_FILE_ENDINGS.some((ending) => url.endsWith(ending));

    const isImage = IMAGE_FILE_ENDINGS.some((ending) => url.endsWith(ending));

    if (isVideo) {
        return videoOveride ?? (
            <video autoPlay muted loop className={clsx('object-cover', className)}>
                <source src={url} />
            </video>
        );
    }

    if (isImage) {
        return imageOveride ?? (
            <img className={clsx('object-cover', className)} src={url} alt="media" />
        );
    }

    return <span>Requested media could not be identified as either image or video</span>;
}
