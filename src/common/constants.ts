export const URL_COMPLIANT_REGEX = /^[\w-]*$/;
export const DEFAULT_QUARTET_IMAGE = 'defaultqt-photo.png';
export const DEFAULT_REQUIRED_FIELD_MESSAGE = 'Required';
export const DEFAULT_TOO_SHORT_MESSAGE = 'Too short';
export const DEFAULT_TOO_LONG_MESSAGE = 'Too long';

export const MAX_IMAGE_SIZE_BYTES = 40e6;
export const MAX_VIDEO_SIZE_BYTES = 100e6;

export const VALID_IMAGE_FORMATS = {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/svg+xml': ['.svg'],
};

export const VALID_VIDEO_FORMATS = {
    'video/mp4': ['.mp4'],
    'video/mpeg': ['.mpeg'],
    'video/webm': ['.webm'],
};
