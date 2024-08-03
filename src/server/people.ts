import * as yup from 'yup';
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
    })).mutation(async ({ ctx, input }) => ctx.prisma.person.update({ where: { id: input.previousId }, data: { biography: input.biography, name: input.name, id: input.newId } })),
});
