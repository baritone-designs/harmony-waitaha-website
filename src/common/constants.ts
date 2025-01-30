export const URL_COMPLIANT_REGEX = /^[\w-]*$/;
export const DEFAULT_QUARTET_IMAGE = 'defaultqt-photo.png';
export const DEFAULT_REQUIRED_FIELD_MESSAGE = 'Required';
export const DEFAULT_TOO_SHORT_MESSAGE = 'Too short';
export const DEFAULT_TOO_LONG_MESSAGE = 'Too long';

export const MAX_IMAGE_SIZE_BYTES = 40e6;
export const MAX_VIDEO_SIZE_BYTES = 100e6;

export const IMAGE_FORMAT_MAPS = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/svg+xml': ['.svg'],
    'image/webp': ['.webp'],
};

export const IMAGE_FILE_TYPES = Object.keys(IMAGE_FORMAT_MAPS) as (keyof typeof IMAGE_FORMAT_MAPS)[];
export const IMAGE_FILE_ENDINGS = Object.values(IMAGE_FORMAT_MAPS).flat();

export const VIDEO_FORMAT_MAPS = {
    'video/mp4': ['.mp4'],
    'video/mpeg': ['.mpeg'],
    'video/webm': ['.webm'],
};

export const VIDEO_FILE_TYPES = Object.keys(VIDEO_FORMAT_MAPS) as (keyof typeof VIDEO_FORMAT_MAPS)[];
export const VIDEO_FILE_ENDINGS = Object.values(VIDEO_FORMAT_MAPS).flat();
