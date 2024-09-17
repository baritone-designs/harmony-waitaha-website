import * as yup from 'yup';
import { EventSchema } from '@/common/schema';
import { privateProcedure, publicProcedure, router } from './trpc';

export const eventsRouter = router({
    allEvents: publicProcedure.query(({ ctx }) => ctx.prisma.event.findMany({
        include: {
            choruses: {
                select: { id: true },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    })),

    editEvent: privateProcedure.input(EventSchema.partial().concat(yup.object().shape({
        id: yup.string().required(),
    }))).mutation(({ ctx, input: { id, choruses, ...values } }) => ctx.prisma.event.update({
        where: { id },
        data: {
            ...values,
            choruses: { set: choruses?.map((id) => ({ id })) },
        },
    })),

    createEvent: privateProcedure.input(EventSchema).mutation(({ ctx, input: { choruses, ...values } }) => ctx.prisma.event.create({
        data: {
            ...values,
            choruses: { connect: choruses?.map((id) => ({ id })) },
        },
    })),

    deleteEvent: privateProcedure.input(yup.string().required()).mutation(({ ctx, input }) => ctx.prisma.event.delete({ where: { id: input } })),
});
