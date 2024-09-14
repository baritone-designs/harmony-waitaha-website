import * as yup from 'yup';
import { PersonChorusArraySchema } from '@/common/schema';
import { privateProcedure, publicProcedure, router } from './trpc';

export const peopleRouter = router({
    allPeople: publicProcedure.query(async ({ ctx }) => {
        const people = await ctx.prisma.person.findMany({
            include: {
                choruses: true,
            },
        });

        return people;
    }),

    editPerson: privateProcedure.input(yup.object().shape({
        id: yup.string().required(),

        name: yup.string(),

        biography: yup.string(),

        choruses: PersonChorusArraySchema,
    })).mutation(async ({ ctx, input }) => ctx.prisma.person.update({
        where: { id: input.id },
        data: {
            biography: input.biography,
            name: input.name,
            choruses: {
                set: input.choruses?.map(({ chorusId, role }) => ({ chorusId_personId: { chorusId, personId: input.id }, role })),
            },
        },
        include: {
            choruses: {
                select: {
                    chorusId: true,
                    role: true,
                },
            },
        },
    })),

    createPerson: privateProcedure.input(yup.object().shape({
        name: yup.string().required(),

        biography: yup.string().required(),

        iconUrl: yup.string().required(),

        choruses: PersonChorusArraySchema.required(),
    })).mutation(async ({ ctx, input }) => ctx.prisma.person.create({
        data: {
            biography: input.biography,
            iconUrl: input.iconUrl,
            name: input.name,
            choruses: {
                createMany: { data: input.choruses.map(({ chorusId, role }) => ({ chorusId, role })) },
            },
        },
    })),

    deletePerson: privateProcedure.input(yup.string().required()).mutation(async ({ ctx, input }) => ctx.prisma.person.delete({ where: { id: input } })),
});
