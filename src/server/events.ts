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
    }))).mutation(({ ctx, input }) => ctx.prisma.event.update({
        where: { id: input.id },
        data: {
            description: input.description,
            name: input.name,
            address: input.address,
            time: input.time,
            choruses: { set: input.choruses?.map((id) => ({ id })) },
        },
    })),

    createEvent: privateProcedure.input(EventSchema).mutation(({ ctx, input }) => ctx.prisma.event.create({
        data: {
            description: input.description,
            name: input.name,
            address: input.address,
            time: input.time,
            choruses: { connect: input.choruses?.map((id) => ({ id })) },
        },
    })),

    deleteEvent: privateProcedure.input(yup.string().required()).mutation(({ ctx, input }) => ctx.prisma.event.delete({ where: { id: input } })),
});
