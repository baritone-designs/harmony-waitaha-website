'use client';

import { trpc } from '@/common/trpc';
import { Field, Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { Chorus, Event, ChorusId } from '@prisma/client';
import { EventSchema } from '@/common/schema';
import { AnimatePresence, m } from 'framer-motion';
import { RxCross2 } from 'react-icons/rx';
import { Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { formikProps } from '@/components/formikUtils';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import { ReactNode, useState } from 'react';
import dayjs from 'dayjs';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import revalidate from '../revalidate';

type EventSchemaType = yup.InferType<typeof EventSchema>

interface EventPaneProps {
    event?: Event & { choruses: Pick<Chorus, 'id'>[] };
    onSubmit: FormikConfig<EventSchemaType>['onSubmit'];
    onDelete?: () => void;
    layoutId?: string;
    onClose?: () => void;
}

function EventPane({ event, onSubmit, onClose, onDelete, layoutId }: EventPaneProps) {
    return (
        <Formik<EventSchemaType>
            initialValues={{
                name: event?.name ?? '',
                description: event?.description ?? '',
                address: event?.address ?? '',
                time: event?.time ?? new Date(),
                choruses: event?.choruses.map(({ id }) => id) ?? [],
            }}
            validationSchema={EventSchema}
            onSubmit={onSubmit}
        >
            {(formik) => (
                <m.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} layout layoutId={layoutId} className="relative flex flex-col items-center gap-3 rounded-md bg-slate-900 p-5">
                    {onClose && <RxCross2 className="absolute right-1 top-1 cursor-pointer hover:text-slate-500" onClick={onClose} />}
                    <TextField
                        label="Name"
                        variant="standard"
                        fullWidth
                        {...formikProps('name', formik)}
                    />
                    <TextField
                        label="Description"
                        variant="standard"
                        fullWidth
                        multiline
                        {...formikProps('description', formik)}
                    />
                    <LocationAutocomplete name="address" label="Venue" />
                    <DateTimePicker
                        label="Date/time"
                        value={dayjs(formik.values.time)}
                        onChange={(value) => formik.setFieldValue('date', value?.toDate(), true)}
                        className="w-full"
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                error: formik.touched.time && Boolean(formik.errors.time),
                                helperText: formik.touched.time && formik.errors.time as ReactNode,
                            },
                        }}
                    />
                    <FormGroup>
                        {Object.keys(ChorusId).map((id) => (
                            <Field
                                type="checkbox"
                                name="choruses"
                                value={id}
                                key={id}
                                as={FormControlLabel}
                                control={<Checkbox />}
                                checked={formik.values.choruses.includes(id as ChorusId)}
                                label={id}
                            />
                        ))}
                    </FormGroup>
                    {formik.dirty && <Button onClick={formik.submitForm}>Save</Button>}
                    {onDelete && <Button onClick={onDelete}>Delete</Button>}
                    {formik.isSubmitting && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
                            <CircularProgress />
                        </div>
                    )}
                </m.div>
            )}
        </Formik>
    );
}

export default function EditEvents() {
    const [events, { refetch }] = trpc.react.events.allEvents.useSuspenseQuery();

    const { mutateAsync: deleteEvent } = trpc.react.events.deleteEvent.useMutation();

    const { mutateAsync: editEvent } = trpc.react.events.editEvent.useMutation();

    const { mutateAsync: createEvent } = trpc.react.events.createEvent.useMutation();

    const [newEventOpen, setNewEventOpen] = useState(false);

    return (
        <div className="flex flex-row gap-5">
            <AnimatePresence>
                {events.map((event) => (
                    <EventPane
                        key={event.id}
                        layoutId={event.id}
                        onSubmit={async (values, { resetForm }) => {
                            await editEvent({ id: event.id, ...values });

                            toast.success(`Event: '${event.name}' updated`);

                            await refetch();

                            resetForm({
                                values,
                            });

                            revalidate();
                        }}
                        onDelete={async () => {
                            await deleteEvent(event.id);

                            toast.success(`Event: '${event.name}' deleted`);

                            await refetch();

                            revalidate();
                        }}
                        event={event}
                    />
                ))}
                {newEventOpen ? (
                    <EventPane
                        onClose={() => setNewEventOpen(false)}
                        onSubmit={async (event) => {
                            await createEvent(event);

                            await refetch();
                            setNewEventOpen(false);

                            revalidate();
                        }}
                        layoutId="new-event"
                    />
                ) : <m.button onClick={() => setNewEventOpen(true)} layoutId="new-event" className="h-min rounded-md bg-slate-900 p-3">New Event</m.button>}
            </AnimatePresence>
        </div>
    );
}
