import * as yup from 'yup';
import { PersonSchema } from '@/common/schema';
import { privateProcedure, publicProcedure, router } from './trpc';

export const peopleRouter = router({
    allPeople: publicProcedure.query(({ ctx }) => ctx.prisma.person.findMany({
        include: {
            choruses: {
                select: {
                    chorusId: true,
                    role: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    })),

    editPerson: privateProcedure.input(PersonSchema.partial().concat(yup.object().shape({ id: yup.string().required() }))).mutation(async ({ ctx, input: { id, choruses, ...values } }) => {
        const person = await ctx.prisma.person.update({
            where: { id },
            data: values,
        });

        if (choruses) {
            await ctx.prisma.personChorus.deleteMany({ where: { personId: person.id } });

            await ctx.prisma.personChorus.createMany({
                data: choruses.map(({ chorusId, role }) => ({ chorusId, role, personId: person.id })),
            });
        }

        return person;
    }),

    createPerson: privateProcedure.input(PersonSchema).mutation(({ ctx, input: { choruses, ...values } }) => ctx.prisma.person.create({
        data: {
            ...values,
            choruses: {
                createMany: { data: choruses.map(({ chorusId, role }) => ({ chorusId, role })) },
            },
        },
    })),

    deletePerson: privateProcedure.input(yup.string().required()).mutation(({ ctx, input }) => ctx.prisma.person.delete({ where: { id: input } })),
});
