'use client';

import { PageContentSchema } from '@/common/schema';
import { trpc } from '@/common/trpc';
import { Box, Button, Container, Grid2, IconButton, Paper, Skeleton, Stack, TextField } from '@mui/material';
import { FieldArray, Formik } from 'formik';
import { Suspense } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { formikProps } from '@/components/formikUtils';
import { MediaUpload } from '@/components/MediaUpload';
import Carousel from 'react-multi-carousel';
import MediaRenderer from '@/components/MediaRenderer';
import { Delete } from '@mui/icons-material';
import { PageId } from '@prisma/client';
import revalidate from '../revalidate';

type PageContentSchemaType = yup.InferType<typeof PageContentSchema>

interface ContentPaneProps {
    page: PageId;
}

function ContentPane({ page }: ContentPaneProps) {
    const [pageContent, { refetch }] = trpc.react.content.getPageContent.useSuspenseQuery(page);
    const { mutateAsync: updateContent } = trpc.react.content.setPageContent.useMutation();

    return (
        <Grid2 size={4}>
            <Formik<PageContentSchemaType>
                initialValues={pageContent}
                validationSchema={PageContentSchema}
                onSubmit={async (content, { resetForm }) => {
                    await updateContent({ id: page, ...content });

                    toast.success(`Content for ${page} page updated`);

                    await refetch();

                    resetForm({ values: content });

                    revalidate();
                }}
            >
                {(formik) => (
                    <Paper>
                        <Stack spacing={1} p={2}>
                            <span className="text-xl">{page}</span>
                            <TextField
                                label="About Paragraph"
                                variant="standard"
                                fullWidth
                                multiline
                                {...formikProps('aboutParagraph', formik)}
                            />
                            <TextField
                                label="Recruitment Paragraph"
                                variant="standard"
                                fullWidth
                                multiline
                                {...formikProps('recruitmentParagraph', formik)}
                            />
                            <MediaUpload
                                name="iconUrl"
                                label="Icon"
                                acceptedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
                            >
                                {({ src }) => (
                                    <img
                                        src={src}
                                        alt="page-logo"
                                        className="size-36 rounded-full duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </MediaUpload>
                            <MediaUpload
                                name="logoUrl"
                                label="Logo"
                                acceptedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']}
                            >
                                {({ src }) => (
                                    <img
                                        src={src}
                                        alt="page-logo"
                                        className="size-full duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </MediaUpload>
                            <MediaUpload
                                name="headerMediaUrl"
                                label="Header media"
                                acceptedTypes={['video/mp4', 'image/png', 'image/jpeg', 'image/webp']}
                            >
                                {({ src }) => (
                                    <MediaRenderer
                                        url={src}
                                        className="size-full duration-200 group-hover:opacity-50"
                                    />
                                )}
                            </MediaUpload>
                            <FieldArray name="carouselMediaUrls">
                                {({ remove }) => (
                                    <div className="space-y-2">
                                        {formik.values.carouselMediaUrls.length >= 1 && (
                                            <Carousel
                                                responsive={{
                                                    desktop: {
                                                        breakpoint: { max: 3000, min: 1024 },
                                                        items: 1,
                                                    },
                                                }}
                                                transitionDuration={500}
                                                className="aspect-auto w-full"
                                            >
                                                {formik.values.carouselMediaUrls.map((url, index) => (
                                                    <div className="relative size-full">
                                                        <IconButton sx={{ position: 'absolute', right: 5, bottom: 5, zIndex: 10 }} onClick={() => remove(index)}>
                                                            <Delete />
                                                        </IconButton>
                                                        <MediaUpload
                                                            // eslint-disable-next-line react/no-array-index-key
                                                            key={`${index}:${url}`}
                                                            name={`carouselMediaUrls.${index}`}
                                                            label={`Carousel media ${index + 1}`}
                                                            acceptedTypes={['video/mp4', 'image/png', 'image/jpeg', 'image/webp']}
                                                        >
                                                            {({ src }) => (
                                                                <MediaRenderer
                                                                    url={src}
                                                                    className="size-full duration-200 group-hover:opacity-50"
                                                                />
                                                            )}
                                                        </MediaUpload>
                                                    </div>
                                                ))}
                                            </Carousel>
                                        )}
                                        <MediaUpload
                                            name={`carouselMediaUrls.${formik.values.carouselMediaUrls.length}`}
                                            label="New carousel media"
                                            acceptedTypes={['video/mp4', 'image/png', 'image/jpeg', 'image/webp']}
                                        >
                                            {/* This part will never render */}
                                            {() => null}
                                        </MediaUpload>
                                    </div>
                                )}
                            </FieldArray>
                            {formik.dirty && <Button variant="outlined" onClick={formik.submitForm}>Save</Button>}
                        </Stack>
                    </Paper>
                )}
            </Formik>
        </Grid2>
    );
}

function LoadingPane({ page }: ContentPaneProps) {
    return (
        <Grid2 size={4}>
            <Paper>
                <Stack spacing={1} p={2}>
                    <span className="text-xl">{page}</span>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
                    <Skeleton>
                        <TextField />
                    </Skeleton>
                    <Box display="flex" justifyContent="center">
                        <Skeleton variant="rounded" height={200} width={300} />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Skeleton variant="rounded" height={200} width={300} />
                    </Box>
                </Stack>
            </Paper>
        </Grid2>
    );
}

export default function EditContent() {
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                {Object.keys(PageId).map((page) => (
                    <Suspense key={page} fallback={<LoadingPane page={page as PageId} />}>
                        <ContentPane page={page as PageId} />
                    </Suspense>
                ))}
            </Grid2>
        </Container>
    );
}
