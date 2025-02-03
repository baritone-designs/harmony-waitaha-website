import * as yup from 'yup';
import { env } from '@/common/environment';
import { privateProcedure, router } from './trpc';

export const authRouter = router({
    getEnvironmentWhitelistedEmails: privateProcedure.query(() => env.WHITELISTED_EMAILS?.split(',').map((x) => x.trim()) ?? []),
    getDatabaseWhitelistedEmails: privateProcedure.query(({ ctx }) => ctx.prisma.whitelistedEmail.findMany({ include: { whitelistedBy: true } })),

    whitelistEmail: privateProcedure.input(yup.string().email().required()).mutation(({ ctx, input }) => ctx.prisma.whitelistedEmail.create({
        data: {
            email: input,
            whitelistedById: ctx.session.user.id,
        },
    })),
    unWhitelistEmail: privateProcedure.input(yup.string().email().required()).mutation(({ ctx, input }) => ctx.prisma.whitelistedEmail.delete({
        where: {
            email: input,
        },
    })),
});
