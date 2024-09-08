import * as yup from 'yup';

const QuartetMemberName = yup.string().required().min(2).max(30)
    .required();

export const QuartetMembersSchema = yup.object().shape({
    tenor: QuartetMemberName,
    lead: QuartetMemberName,
    baritone: QuartetMemberName,
    bass: QuartetMemberName,
});

export const QuartetSocialsSchema = yup.object().shape({
    x: yup.string().required().nullable(),

    instagram: yup.string().required().nullable(),

    youtube: yup.string().required().nullable(),

    facebook: yup.string().required().nullable(),
});
