import { ChorusId } from '@prisma/client';
import * as yup from 'yup';
import { DEFAULT_REQUIRED_FIELD_MESSAGE, DEFAULT_TOO_LONG_MESSAGE, DEFAULT_TOO_SHORT_MESSAGE, URL_COMPLIANT_REGEX } from './constants';

const QuartetMemberName = yup.string().required().min(2, DEFAULT_TOO_SHORT_MESSAGE).max(30, DEFAULT_TOO_LONG_MESSAGE)
    .required(DEFAULT_REQUIRED_FIELD_MESSAGE);

export const QuartetMembersSchema = yup.object().shape({
    tenor: QuartetMemberName,
    lead: QuartetMemberName,
    baritone: QuartetMemberName,
    bass: QuartetMemberName,
});

export const QuartetSocialsSchema = yup.object().shape({
    tiktok: yup.string().required().nullable(),

    instagram: yup.string().required().nullable(),

    youtube: yup.string().required().nullable(),

    facebook: yup.string().required().nullable(),
});

export const ChorusIdSchema = yup.mixed<ChorusId>().oneOf(Object.values(ChorusId));

/**
 * Schema describing the relation between a person and a chorus
 */
export const PersonChorusSchema = yup.object().shape({
    chorusId: ChorusIdSchema.required(),

    role: yup.string().required(DEFAULT_REQUIRED_FIELD_MESSAGE),
});

/**
 * Schema describing an array of choruses to attach to a person with uniqueness enforced
 */
export const PersonChorusArraySchema = yup.array(PersonChorusSchema).test(
    'unique',
    'Do not repeat choruses',
    (array = []) => array.length === new Set(array.map(({ chorusId }) => chorusId)).size,
);

/**
 * Schema describing the required properties and their buonds for a Person object
 */
export const PersonSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, DEFAULT_TOO_SHORT_MESSAGE)
        .max(30, DEFAULT_TOO_LONG_MESSAGE)
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),
    biography: yup
        .string()
        .min(10, DEFAULT_TOO_SHORT_MESSAGE)
        .max(150, DEFAULT_TOO_LONG_MESSAGE)
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    iconUrl: yup.string().url().required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    choruses: PersonChorusArraySchema.required(),
});

/**
 * Schema describing the required properties and their buonds for an event object
 */
export const EventSchema = yup.object().shape({
    name: yup
        .string()
        .min(3, DEFAULT_TOO_SHORT_MESSAGE)
        .max(30, DEFAULT_TOO_LONG_MESSAGE)
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),
    description: yup
        .string()
        .min(10, DEFAULT_TOO_SHORT_MESSAGE)
        .max(150, DEFAULT_TOO_LONG_MESSAGE)
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),
    venueId: yup
        .string()
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),
    venueName: yup
        .string()
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    time: yup.date().required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    choruses: yup.array(ChorusIdSchema.required()).required(),
});

export const QuartetSchema = yup.object().shape({
    id: yup
        .string()
        .min(2, DEFAULT_TOO_SHORT_MESSAGE)
        .max(30, DEFAULT_TOO_LONG_MESSAGE)
        .matches(URL_COMPLIANT_REGEX, 'Must not contain special characters')
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    name: yup
        .string()
        .min(3, DEFAULT_TOO_SHORT_MESSAGE)
        .max(30, DEFAULT_TOO_LONG_MESSAGE)
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    biography: yup
        .string()
        .min(10, DEFAULT_TOO_SHORT_MESSAGE)
        .max(150, DEFAULT_TOO_LONG_MESSAGE)
        .required(DEFAULT_REQUIRED_FIELD_MESSAGE),

    members: QuartetMembersSchema,

    socials: QuartetSocialsSchema,

    backgroundImageUrl: yup.string().url().required().nullable(),
    imageUrl: yup.string().url().required().nullable(),
    logoUrl: yup.string().url().required().nullable(),
    websiteUrl: yup.string().url().required().nullable(),
});
