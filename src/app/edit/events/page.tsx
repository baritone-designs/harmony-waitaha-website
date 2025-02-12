'use client';

import { trpc } from '@/common/trpc';
import { Field, Formik, FormikConfig } from 'formik';
import * as yup from 'yup';
import { Chorus, Event, ChorusId } from '@prisma/client';
import { EventSchema } from '@/common/schema';
import { Backdrop, Button, Checkbox, CircularProgress, Container, Fab, FormControlLabel, FormGroup, Grid2, IconButton, Paper, Stack, TextField } from '@mui/material';
import { formikProps } from '@/components/formikUtils';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { toast } from 'react-toastify';
import { ReactNode, useCallback, useState } from 'react';
import dayjs from 'dayjs';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { Add, Close } from '@mui/icons-material';
import { NullableTextField } from '@/components/NullableTextField';
import revalidate from '../revalidate';

type EventSchemaType = yup.InferType<typeof EventSchema>

type EventPaneProps = {
    onSubmit: FormikConfig<EventSchemaType>['onSubmit'];
} & ({
    type: 'existing';
    event: Event & { choruses: Pick<Chorus, 'id'>[] };
    onDelete?: () => void;
} | {
    type: 'new';
    event?: Event & { choruses: Pick<Chorus, 'id'>[] };
    onClose: () => void;
})

function EventPane({ event, onSubmit, ...props }: EventPaneProps) {
    return (
        <Grid2 size={3}>
            <Formik<EventSchemaType>
                initialValues={{
                    name: event?.name ?? '',
                    description: event?.description ?? '',
                    venueId: event?.venueId ?? '',
                    venueName: event?.venueName ?? '',
                    time: event?.time ?? new Date(),
                    learnMoreUrl: event?.learnMoreUrl ?? null,
                    choruses: event?.choruses.map(({ id }) => id) ?? [],
                }}
                validationSchema={EventSchema}
                onSubmit={onSubmit}
            >
                {(formik) => (
                    <Paper className="relative">
                        {props.type === 'new' && <IconButton sx={{ position: 'absolute', right: 2, top: 2, zIndex: 10 }} onClick={props.onClose}><Close /></IconButton>}
                        <Stack spacing={1} p={2}>
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
                            <NullableTextField
                                label="Learn More Url"
                                variant="standard"
                                fullWidth
                                {...formikProps('learnMoreUrl', formik)}
                            />
                            <LocationAutocomplete idField="venueId" nameField="venueName" label="Venue" />
                            <DateTimePicker
                                label="Date/time"
                                timezone="system"
                                value={dayjs(formik.values.time)}
                                onChange={(value) => formik.setFieldValue('time', value?.toDate(), true)}
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
                            {(formik.dirty || props.type === 'new') && <Button variant="outlined" onClick={formik.submitForm}>{props.type === 'existing' ? 'Update' : 'Save'}</Button>}
                            {props.type === 'existing' && <Button variant="outlined" color="error" onClick={props.onDelete}>Delete</Button>}
                            <Backdrop sx={{ position: 'absolute' }} open={formik.isSubmitting}>
                                <CircularProgress />
                            </Backdrop>
                        </Stack>
                    </Paper>
                )}
            </Formik>
        </Grid2>
    );
}

export default function EditEvents() {
    const [events, { refetch }] = trpc.react.events.allEvents.useSuspenseQuery();

    const { mutateAsync: deleteEvent } = trpc.react.events.deleteEvent.useMutation();

    const { mutateAsync: editEvent } = trpc.react.events.editEvent.useMutation();

    const { mutateAsync: createEvent } = trpc.react.events.createEvent.useMutation();

    const [newEvents, setNewEvents] = useState<string[]>([]);

    const closeNewEvent = useCallback(
        (id: string) => setNewEvents((events) => events.filter((x) => x !== id)),
        [setNewEvents],
    );

    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                {events.map((event) => (
                    <EventPane
                        type="existing"
                        key={event.id}
                        onSubmit={async (values, { resetForm }) => {
                            await editEvent({ id: event.id, ...values });

                            toast.success(`Evemt: '${event.name}' updated`);

                            await refetch();

                            resetForm({ values });

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
                {newEvents.map((id) => (
                    <EventPane
                        type="new"
                        key={id}
                        onClose={() => closeNewEvent(id)}
                        onSubmit={async (person) => {
                            await createEvent(person);

                            await refetch();
                            closeNewEvent(id);

                            revalidate();
                        }}
                    />
                ))}
            </Grid2>
            <Fab
                variant="extended"
                color="primary"
                onClick={() => setNewEvents((events) => [...events, Math.random().toString(36).slice(2, 7)])}
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                <Add sx={{ mr: 1 }} />
                New Event
            </Fab>
        </Container>
    );
}
