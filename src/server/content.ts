import * as yup from 'yup';
import { PageContentSchema, PageTypeSchema } from '@/common/schema';
import { ParagraphContentType, PrimaryMediaContentType } from '@prisma/client';
import { privateProcedure, router } from './trpc';

export const contentRouter = router({
    getPageContent: privateProcedure.input(PageTypeSchema.required()).output(PageContentSchema).query(async ({ ctx, input }) => {
        const [paragraphEntries, images] = await ctx.prisma.$transaction([
            ctx.prisma.paragraphContent.findMany({
                where: {
                    page: input,
                },
            }),
            ctx.prisma.primaryMediaContent.findMany({
                where: {
                    page: input,
                },
                orderBy: {
                    index: 'asc',
                },
            }),
        ]);

        return {
            paragraphs: paragraphEntries.reduce((acc, paragraph) => ({ ...acc, [paragraph.type]: paragraph.content }), {}),
            media: Object.keys(PrimaryMediaContentType)
                .reduce((acc, key) => ({ ...acc, [key]: images.filter(({ type }) => type === key).map(({ url }) => url) }), {} as Record<PrimaryMediaContentType, string[]>),
        };
    }),

    setPageContent: privateProcedure.input(yup.object({
        page: PageTypeSchema.required(),
        content: PageContentSchema,
    })).mutation(async ({ ctx, input }) => {
        await ctx.prisma.$transaction([
            ctx.prisma.paragraphContent.deleteMany({
                where: {
                    page: input.page,
                },
            }),
            ctx.prisma.primaryMediaContent.deleteMany({
                where: {
                    page: input.page,
                },
            }),
        ]);

        await ctx.prisma.$transaction([
            ctx.prisma.paragraphContent.createMany({
                data: Object.entries(input.content.paragraphs).map(([key, value]) => ({
                    content: value,
                    page: input.page,
                    type: key as ParagraphContentType,
                })),
            }),
            ctx.prisma.primaryMediaContent.createMany({
                data: Object.entries(input.content.media).flatMap(([type, urls]) => urls.map((url, index) => ({
                    url,
                    index,
                    page: input.page,
                    type: type as PrimaryMediaContentType,
                }))),
            }),
        ]);
    }),
});
