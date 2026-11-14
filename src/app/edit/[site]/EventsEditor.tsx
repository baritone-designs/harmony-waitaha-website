'use client';

import { EventSchema } from '@/common/schema';
import { CHORUS_INFO } from '@/common/sites';
import { trpc } from '@/common/trpc';
import { formikProps } from '@/components/formikUtils';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { NullableTextField } from '@/components/NullableTextField';
import { Checkbox, Chip, FormControlLabel, FormGroup, FormLabel, Grid, Stack, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ChorusId } from '@prisma/client';
import dayjs from 'dayjs';
import { Formik, useFormikContext } from 'formik';
import { ReactNode } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import ConfirmButton from '../_components/ConfirmButton';
import ItemCard from '../_components/ItemCard';
import TabToolbar, { ITEM_GRID_SIZE } from '../_components/TabToolbar';
import useNewItems from '../_components/useNewItems';
import revalidate from '../revalidate';

type EventValues = yup.InferType<typeof EventSchema>;

function EventFields() {
    const formik = useFormikContext<EventValues>();

    const toggleChorus = (id: ChorusId, checked: boolean) => formik.setFieldValue(
        'choruses',
        checked ? [...formik.values.choruses, id] : formik.values.choruses.filter((x) => x !== id),
    );

    return (
        <>
            <TextField label="Name" variant="standard" fullWidth {...formikProps('name', formik)} />
            <TextField label="Description" variant="standard" fullWidth multiline {...formikProps('description', formik)} />
            <LocationAutocomplete idField="venueId" nameField="venueName" label="Venue" />
            <DateTimePicker
                label="Date/time"
                timezone="system"
                value={dayjs(formik.values.time)}
                onChange={(value) => formik.setFieldValue('time', value?.toDate(), true)}
                className="w-full"
                slotProps={{
                    textField: {
                        error: formik.touched.time && Boolean(formik.errors.time),
                        helperText: formik.touched.time && formik.errors.time as ReactNode,
                    },
                }}
            />
            <NullableTextField label="Learn more link" variant="standard" fullWidth {...formikProps('learnMoreUrl', formik)} />
            <FormGroup>
                <FormLabel>Show on chorus pages</FormLabel>
                {Object.values(ChorusId).map((id) => (
                    <FormControlLabel
                        key={id}
                        label={CHORUS_INFO[id].name}
                        control={(
                            <Checkbox
                                checked={formik.values.choruses.includes(id)}
                                onChange={(e) => toggleChorus(id, e.target.checked)}
                            />
                        )}
                    />
                ))}
            </FormGroup>
        </>
    );
}

interface EventsEditorProps {
    /** Only show events for this chorus, or all events if null */
    chorusId: ChorusId | null;
}

export default function EventsEditor({ chorusId }: EventsEditorProps) {
    const [allEvents, { refetch }] = trpc.react.events.allEvents.useSuspenseQuery();
    const { mutateAsync: createEvent } = trpc.react.events.createEvent.useMutation();
    const { mutateAsync: editEvent } = trpc.react.events.editEvent.useMutation();
    const { mutateAsync: deleteEvent } = trpc.react.events.deleteEvent.useMutation();

    const [newEvents, addNewEvent, removeNewEvent] = useNewItems();

    const events = allEvents
        .filter((event) => !chorusId || event.choruses.some(({ id }) => id === chorusId))
        .sort((a, b) => a.time.getTime() - b.time.getTime());

    const refresh = async () => {
        await refetch();
        revalidate();
    };

    return (
        <Stack spacing={2}>
            <TabToolbar
                description={chorusId
                    ? `Events shown on the ${CHORUS_INFO[chorusId].name} page. Every event is also shown on the Harmony Waitaha homepage.`
                    : 'Every event is shown on the Harmony Waitaha homepage, and on the pages of the choruses ticked for it. Past events stay visible until they are deleted.'}
                addLabel="New event"
                onAdd={addNewEvent}
            />
            <Grid container spacing={2}>
                {newEvents.map((key) => (
                    <Grid key={key} size={ITEM_GRID_SIZE}>
                        <Formik<EventValues>
                            initialValues={{
                                name: '',
                                description: '',
                                venueId: '',
                                venueName: '',
                                time: new Date(),
                                learnMoreUrl: null,
                                choruses: chorusId ? [chorusId] : [],
                            }}
                            validationSchema={EventSchema}
                            onSubmit={async (values) => {
                                await createEvent(values);

                                toast.success(`Event '${values.name}' created`);

                                removeNewEvent(key);

                                await refresh();
                            }}
                        >
                            <ItemCard isNew onCancel={() => removeNewEvent(key)}>
                                <EventFields />
                            </ItemCard>
                        </Formik>
                    </Grid>
                ))}
                {events.map((event) => (
                    <Grid key={event.id} size={ITEM_GRID_SIZE}>
                        <Formik<EventValues>
                            initialValues={{
                                name: event.name,
                                description: event.description,
                                venueId: event.venueId,
                                venueName: event.venueName,
                                time: event.time,
                                learnMoreUrl: event.learnMoreUrl,
                                choruses: event.choruses.map(({ id }) => id),
                            }}
                            validationSchema={EventSchema}
                            onSubmit={async (values, { resetForm }) => {
                                await editEvent({ id: event.id, ...values });

                                toast.success(`Event '${values.name}' updated`);

                                resetForm({ values });

                                await refresh();
                            }}
                        >
                            <ItemCard
                                header={dayjs(event.time).isBefore(dayjs()) && (
                                    <Chip size="small" color="warning" label="Past event - still shown on the website" sx={{ alignSelf: 'flex-start' }} />
                                )}
                                deleteButton={(
                                    <ConfirmButton
                                        color="error"
                                        title={`Delete '${event.name}'?`}
                                        confirmLabel="Delete"
                                        message="This event will be removed from every page it is shown on."
                                        onConfirm={async () => {
                                            await deleteEvent(event.id);

                                            toast.success(`Event '${event.name}' deleted`);

                                            await refresh();
                                        }}
                                    >
                                        Delete
                                    </ConfirmButton>
                                )}
                            >
                                <EventFields />
                            </ItemCard>
                        </Formik>
                    </Grid>
                ))}
            </Grid>
            {events.length === 0 && newEvents.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={4}>There are no events yet.</Typography>
            )}
        </Stack>
    );
}
