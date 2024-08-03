import * as yup from 'yup';
import { ChorusId } from '@prisma/client';
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
        previousId: yup.string().required(),

        newId: yup.string(),

        name: yup.string(),

        biography: yup.string(),

        choruses: yup.array(yup.object().shape({
            chorusId: yup.mixed<ChorusId>().oneOf(Object.values(ChorusId)).required(),

            role: yup.string().required(),
        })),
    })).mutation(async ({ ctx, input }) => {
        const person = await ctx.prisma.person.update({
            where: { id: input.previousId },
            data: { biography: input.biography, name: input.name, id: input.newId },
        });

        if (input.choruses) {
            await ctx.prisma.personChorus.deleteMany({ where: { personId: person.id } });

            await ctx.prisma.personChorus.createMany({ data: input.choruses.map(({ chorusId, role }) => ({ chorusId, role, personId: person.id })) });
        }

        return person;
    }),
});
