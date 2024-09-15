import * as yup from 'yup';
import { QuartetSchema } from '@/common/schema';
import { privateProcedure, publicProcedure, router } from './trpc';

export const quartetsRouter = router({
    allQuartets: publicProcedure.query(async ({ ctx }) => ctx.prisma.quartet.findMany()),

    editQuartet: privateProcedure.input(QuartetSchema.omit(['id']).concat(yup.object().shape({
        previousId: yup.string().required(),

        newId: yup.string(),
    }))).mutation(async ({ ctx, input: { previousId, newId, ...values } }) => ctx.prisma.quartet.update({
        where: { id: previousId },
        data: { id: newId, ...values },
    })),

    createQuartet: privateProcedure.input(QuartetSchema).mutation(async ({ ctx, input }) => ctx.prisma.quartet.create({
        data: input,
    })),

    deleteQuartet: privateProcedure.input(yup.string().required()).mutation(async ({ ctx, input }) => ctx.prisma.quartet.delete({ where: { id: input } })),
});
