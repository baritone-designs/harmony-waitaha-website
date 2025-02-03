import * as yup from 'yup';
import { PageContentSchema, PageIdSchema } from '@/common/schema';
import { privateProcedure, router } from './trpc';

export const contentRouter = router({
    getPageContent: privateProcedure.input(PageIdSchema.required()).query(async ({ ctx, input }) => {
        const content = await ctx.prisma.page.findFirstOrThrow({
            where: { id: input },
        });

        return content;
    }),

    setPageContent: privateProcedure.input(PageContentSchema.concat(yup.object().shape({ id: PageIdSchema }))).mutation(async ({ ctx, input: { id, ...input } }) => ctx.prisma.page.update({
        where: { id },
        data: input,
    })),
});
