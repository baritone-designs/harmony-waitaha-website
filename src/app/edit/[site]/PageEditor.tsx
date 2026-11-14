'use client';

import { ChorusSchema, PageContentSchema } from '@/common/schema';
import { Site } from '@/common/sites';
import { trpc } from '@/common/trpc';
import { formikProps } from '@/components/formikUtils';
import MediaRenderer from '@/components/MediaRenderer';
import { MediaUpload } from '@/components/MediaUpload';
import SocialsEditor from '@/components/SocialsEditor';
import { Delete } from '@mui/icons-material';
import { Button, Grid, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { ChorusId } from '@prisma/client';
import { FieldArray, Formik, useFormikContext } from 'formik';
import { PropsWithChildren } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import revalidate from '../revalidate';

const PageFormSchema = yup.object({
    page: PageContentSchema.required(),
    /** Null for sites which aren't a chorus (the Harmony Waitaha homepage) */
    chorus: ChorusSchema.nullable().default(null),
});

type PageFormValues = yup.InferType<typeof PageFormSchema>;

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'] as const;
const MEDIA_TYPES = ['video/mp4', 'image/png', 'image/jpeg', 'image/webp'] as const;

function Section({ title, description, children }: PropsWithChildren<{ title: string, description?: string }>) {
    return (
        <Paper>
            <Stack spacing={1.5} p={2}>
                <div>
                    <Typography variant="h6">{title}</Typography>
                    {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
                </div>
                {children}
            </Stack>
        </Paper>
    );
}

function SaveBar() {
    const { dirty, isSubmitting, submitForm, resetForm } = useFormikContext();

    if (!dirty) {
        return null;
    }

    return (
        <Paper
            elevation={8}
            sx={{ position: 'sticky', bottom: 16, mt: 2, p: 1.5, pl: 2, display: 'flex', alignItems: 'center', gap: 1, zIndex: 10 }}
        >
            <Typography sx={{ flexGrow: 1 }}>You have unsaved changes</Typography>
            <Button onClick={() => resetForm()} disabled={isSubmitting}>Discard</Button>
            <Button variant="contained" onClick={submitForm} loading={isSubmitting}>Save</Button>
        </Paper>
    );
}

function CarouselEditor() {
    const { values } = useFormikContext<PageFormValues>();
    const urls = values.page.carouselMediaUrls;

    return (
        <FieldArray name="page.carouselMediaUrls">
            {({ remove }) => (
                <Stack spacing={1}>
                    <div className="grid grid-cols-2 gap-2">
                        {urls.map((url, index) => (
                            <div key={url} className="relative">
                                <MediaUpload name={`page.carouselMediaUrls.${index}`} label="photo/video" acceptedTypes={[...MEDIA_TYPES]}>
                                    {({ src }) => (
                                        <MediaRenderer url={src} className="aspect-video w-full rounded-md object-cover duration-200 group-hover:opacity-50" />
                                    )}
                                </MediaUpload>
                                <IconButton
                                    size="small"
                                    aria-label="Remove from carousel"
                                    sx={{ position: 'absolute', right: 4, top: 4, bgcolor: 'rgba(0,0,0,0.6)' }}
                                    onClick={() => remove(index)}
                                >
                                    <Delete fontSize="small" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                    {/* Uploading into the next index appends to the list */}
                    <MediaUpload name={`page.carouselMediaUrls.${urls.length}`} label="carousel photo/video" acceptedTypes={[...MEDIA_TYPES]}>
                        {() => null}
                    </MediaUpload>
                </Stack>
            )}
        </FieldArray>
    );
}

interface PageFormProps {
    site: Site;
    initialValues: PageFormValues;
    onSaved: () => Promise<unknown>;
}

function PageForm({ site, initialValues, onSaved }: PageFormProps) {
    const { mutateAsync: setPageContent } = trpc.react.content.setPageContent.useMutation();
    const { mutateAsync: setChorus } = trpc.react.choruses.setChorus.useMutation();

    const isChorus = site.chorusId !== null;

    return (
        <Formik<PageFormValues>
            initialValues={initialValues}
            validationSchema={PageFormSchema}
            onSubmit={async (values, { resetForm }) => {
                await Promise.all([
                    setPageContent({ ...values.page, id: site.pageId }),
                    site.chorusId && values.chorus && setChorus({ ...values.chorus, id: site.chorusId }),
                ]);

                toast.success(`${site.name} page updated`);

                await onSaved();

                resetForm({ values });

                revalidate();
            }}
        >
            {(formik) => (
                <>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Stack spacing={2}>
                                <Section title="Search & browser tab" description="Shown in the browser tab, search results and link previews">
                                    <TextField label="Title" fullWidth {...formikProps('page.title', formik)} />
                                    <TextField label="Description" fullWidth multiline minRows={2} {...formikProps('page.description', formik)} />
                                </Section>
                                <Section title="About" description="The introduction near the top of the page">
                                    <TextField label="About paragraph" fullWidth multiline minRows={4} {...formikProps('page.aboutParagraph', formik)} />
                                </Section>
                                <Section title="Join us" description="Recruitment text near the bottom of the page">
                                    <TextField label="Recruitment paragraph" fullWidth multiline minRows={4} {...formikProps('page.recruitmentParagraph', formik)} />
                                </Section>
                                {isChorus && (
                                    <Section title="Social media" description="Shown in the page footer. Just enter the account name, not the full link">
                                        <SocialsEditor fieldName="chorus.socials" formik={formik} />
                                    </Section>
                                )}
                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Stack spacing={2}>
                                <Section title="Header" description="Large image or video at the top of the page">
                                    <MediaUpload name="page.headerMediaUrl" label="header media" acceptedTypes={[...MEDIA_TYPES]}>
                                        {({ src }) => <MediaRenderer url={src} className="aspect-video w-full rounded-md object-cover duration-200 group-hover:opacity-50" />}
                                    </MediaUpload>
                                </Section>
                                <Section title="Logos" description="The icon is used as the browser tab icon (and in the menu bar for chorus pages)">
                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <MediaUpload name="page.iconUrl" label="icon" acceptedTypes={[...IMAGE_TYPES]}>
                                            {({ src }) => <img src={src} alt="page-icon" className="mx-auto size-28 rounded-full object-contain duration-200 group-hover:opacity-50" />}
                                        </MediaUpload>
                                        <MediaUpload name="page.logoUrl" label="logo" acceptedTypes={[...IMAGE_TYPES]}>
                                            {({ src }) => <img src={src} alt="page-logo" className="w-full object-contain duration-200 group-hover:opacity-50" />}
                                        </MediaUpload>
                                    </div>
                                </Section>
                                {isChorus && (
                                    <Section title="Photo carousel" description="Photos and videos shown next to the about section. Click one to replace it">
                                        <CarouselEditor />
                                    </Section>
                                )}
                                {isChorus && (
                                    <Section title="Harmony Waitaha homepage card" description={`Background of the ${site.name} card on the Harmony Waitaha homepage`}>
                                        <MediaUpload name="chorus.imageUrl" label="card image" acceptedTypes={[...IMAGE_TYPES]}>
                                            {({ src }) => <img src={src} alt="chorus-card" className="aspect-video w-full rounded-md object-cover duration-200 group-hover:opacity-50" />}
                                        </MediaUpload>
                                    </Section>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                    <SaveBar />
                </>
            )}
        </Formik>
    );
}

function HomePageEditor({ site }: { site: Site }) {
    const [page, { refetch }] = trpc.react.content.getPageContent.useSuspenseQuery(site.pageId);

    return <PageForm site={site} initialValues={{ page, chorus: null }} onSaved={refetch} />;
}

function ChorusPageEditor({ site, chorusId }: { site: Site, chorusId: ChorusId }) {
    const [[page, chorus], [pageQuery, chorusQuery]] = trpc.react.useSuspenseQueries((t) => [
        t.content.getPageContent(site.pageId),
        t.choruses.getChorus(chorusId),
    ]);

    return (
        <PageForm
            site={site}
            initialValues={{ page, chorus }}
            onSaved={() => Promise.all([pageQuery.refetch(), chorusQuery.refetch()])}
        />
    );
}

export default function PageEditor({ site }: { site: Site }) {
    return site.chorusId
        ? <ChorusPageEditor site={site} chorusId={site.chorusId} />
        : <HomePageEditor site={site} />;
}
