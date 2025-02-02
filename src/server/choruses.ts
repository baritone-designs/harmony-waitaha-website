import * as yup from 'yup';
import { ChorusIdSchema, ChorusSchema } from '@/common/schema';
import { privateProcedure, router } from './trpc';

export const chorusesRouter = router({
    getChorus: privateProcedure.input(ChorusIdSchema.required()).query(async ({ ctx, input }) => {
        const content = await ctx.prisma.chorus.findFirstOrThrow({
            where: { id: input },
            select: {
                imageUrl: true,
                socials: true,
            },
        });

        return content;
    }),

    setChorus: privateProcedure.input(ChorusSchema.concat(yup.object().shape({ id: ChorusIdSchema }))).mutation(async ({ ctx, input: { id, ...input } }) => ctx.prisma.chorus.update({
        where: { id },
        data: input,
    })),
});
