import * as yup from 'yup';
import { ChorusId } from '@prisma/client';
import { privateProcedure, publicProcedure, router } from './trpc';

export const eventsRouter = router({
    allEvents: publicProcedure.query(async ({ ctx }) => {
        const events = await ctx.prisma.event.findMany({
            include: {
                choruses: {
                    select: { id: true },
                },
            },
        });

        return events;
    }),

    editEvent: privateProcedure.input(yup.object().shape({
        id: yup.string().required(),

        name: yup.string(),

        description: yup.string(),

        address: yup.string(),

        time: yup.date(),

        choruses: yup.array(yup.mixed<ChorusId>().oneOf(Object.values(ChorusId)).required()),
    })).mutation(async ({ ctx, input }) => {
        console.log(input.time);
        return ctx.prisma.event.update({
            where: { id: input.id },
            data: {
                description: input.description,
                name: input.name,
                address: input.address,
                time: input.time,
                choruses: { set: input.choruses?.map((id) => ({ id })) },
            },
        });
    }),

    createEvent: privateProcedure.input(yup.object().shape({
        name: yup.string().required(),

        description: yup.string().required(),

        time: yup.date().required(),

        address: yup.string().required(),

        choruses: yup.array(yup.mixed<ChorusId>().oneOf(Object.values(ChorusId)).required()),
    })).mutation(async ({ ctx, input }) => ctx.prisma.event.create({
        data: {
            description: input.description,
            name: input.name,
            address: input.address,
            time: input.time,
            choruses: { connect: input.choruses?.map((id) => ({ id })) },
        },
    })),

    deleteEvent: privateProcedure.input(yup.string().required()).mutation(async ({ ctx, input }) => ctx.prisma.event.delete({ where: { id: input } })),
});
