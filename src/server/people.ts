import { publicProcedure, router } from './trpc';

export const peopleRouter = router({
    allPeople: publicProcedure.query(async ({ ctx }) => {
        const people = await ctx.prisma.person.findMany({
            include: {
                choruses: true,
            },
        });

        return people;
    }),
});
