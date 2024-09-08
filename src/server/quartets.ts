import * as yup from 'yup';
import { QuartetMembersSchema, QuartetSocialsSchema } from '@/common/schema';
import { privateProcedure, publicProcedure, router } from './trpc';

export const quartetsRouter = router({
    allQuartets: publicProcedure.query(async ({ ctx }) => ctx.prisma.quartet.findMany()),

    editQuartet: privateProcedure.input(yup.object().shape({
        previousId: yup.string().required(),

        newId: yup.string(),

        name: yup.string(),

        biography: yup.string(),

        websiteUrl: yup.string().nullable(),

        socials: QuartetSocialsSchema,

        members: QuartetMembersSchema,
    })).mutation(async ({ ctx, input }) => ctx.prisma.quartet.update({
        where: { id: input.previousId },
        data: { biography: input.biography, name: input.name, id: input.newId, socials: input.socials, members: input.members, websiteUrl: input.websiteUrl },
    })),

    createQuartet: privateProcedure.input(yup.object().shape({
        id: yup.string().required(),

        name: yup.string().required(),

        biography: yup.string().required(),

        websiteUrl: yup.string(),

        socials: QuartetSocialsSchema.required(),

        members: QuartetMembersSchema.required(),
    })).mutation(async ({ ctx, input: { id, name, biography, socials, members, websiteUrl } }) => ctx.prisma.quartet.create({
        data: {
            id,

            name,

            biography,

            socials,

            members,

            websiteUrl,
        },
    })),

    deleteQuartet: privateProcedure.input(yup.string().required()).mutation(async ({ ctx, input }) => ctx.prisma.quartet.delete({ where: { id: input } })),
});
