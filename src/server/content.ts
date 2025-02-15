import * as yup from 'yup';
import { PageContentSchema, PageIdSchema } from '@/common/schema';
import { GenerateSignedPostPolicyV4Options } from '@google-cloud/storage';
import { MAX_VIDEO_SIZE_BYTES } from '@/common/constants';
import { randomBytes } from 'node:crypto';
import { privateProcedure, router } from './trpc';

export const contentRouter = router({
    getMediaUploadUrl: privateProcedure.input(yup.string().required()).query(async ({ ctx, input }) => {
        // Needed to prevent filename clashes
        const file = ctx.bucket.file(`${randomBytes(16).toString('hex')}-${input}`);

        const options: GenerateSignedPostPolicyV4Options = {
            expires: Date.now() + 5 * 60 * 1000, // 5 Minute limit
            conditions: [
                ['content-length-range', 0, MAX_VIDEO_SIZE_BYTES],
            ],
        };

        const [response] = await file.generateSignedPostPolicyV4(options);

        return [response, file.publicUrl()] as const;
    }),

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
