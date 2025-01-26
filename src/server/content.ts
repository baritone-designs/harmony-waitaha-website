import * as yup from 'yup';
import { PageContentSchema, PageTypeSchema } from '@/common/schema';
import { ParagraphContent, ParagraphContentType } from '@prisma/client';
import { privateProcedure, router } from './trpc';

function mapParagraphEntries(data: ParagraphContent[]): Partial<Record<ParagraphContentType, string>> {
    return data.reduce((acc, paragraph) => ({ ...acc, [paragraph.type]: paragraph.content }), {});
}

export const contentRouter = router({
    getPageContent: privateProcedure.input(PageTypeSchema.required()).output(PageContentSchema).query(async ({ ctx, input }) => {
        const paragraphEntries = await ctx.prisma.paragraphContent.findMany({
            where: {
                page: input,
            },
        });

        return {
            paragraphs: mapParagraphEntries(paragraphEntries),
        };
    }),

    setPageContent: privateProcedure.input(yup.object({
        page: PageTypeSchema.required(),
        content: PageContentSchema,
    })).output(PageContentSchema).mutation(async ({ ctx, input }) => {
        await ctx.prisma.paragraphContent.deleteMany({
            where: {
                page: input.page,
            },
        });

        const paragraphEntries = await ctx.prisma.paragraphContent.createManyAndReturn({
            data: Object.entries(input.content.paragraphs).map(([key, value]) => ({
                content: value,
                page: input.page,
                type: key as ParagraphContentType,
            })),
        });

        return {
            paragraphs: mapParagraphEntries(paragraphEntries),
        };
    }),
});
