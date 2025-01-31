import { IconType } from 'react-icons';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutubeSquare } from 'react-icons/fa';

export const URL_COMPLIANT_REGEX = /^[\w-]*$/;
export const DEFAULT_QUARTET_IMAGE = 'defaultqt-photo.png';
export const DEFAULT_REQUIRED_FIELD_MESSAGE = 'Required';
export const DEFAULT_TOO_SHORT_MESSAGE = 'Too short';
export const DEFAULT_TOO_LONG_MESSAGE = 'Too long';

export const MAX_IMAGE_SIZE_BYTES = 40e6;

export const SOCIALS_PREFIX: Record<keyof PrismaJson.QuartetSocials, string> = {
    x: 'https://x.com/',
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/@',
};

export const SOCIALS_ICONS: Record<keyof PrismaJson.QuartetSocials, IconType> = {
    x: FaTwitter,
    facebook: FaFacebook,
    instagram: FaInstagram,
    youtube: FaYoutubeSquare,
};
