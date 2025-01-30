'use client';

import { PageContentSchema } from '@/common/schema';
import { trpc } from '@/common/trpc';
import { Button, capitalize, Container, Grid2, IconButton, Paper, Skeleton, Stack, TextField } from '@mui/material';
import { PageType, ParagraphContentType, PrimaryMediaContentType } from '@prisma/client';
import { FieldArray, Formik } from 'formik';
import { Suspense } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { formikProps } from '@/components/formikUtils';
import { MediaUpload } from '@/components/MediaUpload';
import Carousel from 'react-multi-carousel';
import MediaRenderer from '@/components/MediaRenderer';
import { Delete } from '@mui/icons-material';
import revalidate from '../revalidate';

type PageContentSchemaType = yup.InferType<typeof PageContentSchema>

interface ContentPaneProps {
    page: PageType;
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
                    await updateContent({ page, content });

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
                            {Object.keys(ParagraphContentType).map((key) => (
                                <TextField
                                    key={key}
                                    label={`${capitalize(key)} Paragraph`}
                                    variant="standard"
                                    fullWidth
                                    multiline
                                    {...formikProps(`paragraphs.${key}`, formik)}
                                />
                            ))}
                            {Object.keys(PrimaryMediaContentType).map((key) => (
                                <FieldArray name={`media.${key}`}>
                                    {({ remove }) => (
                                        <div className="space-y-2">
                                            {formik.values.media[key as PrimaryMediaContentType].length >= 1 && (
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
                                                    {formik.values.media[key as PrimaryMediaContentType].map((url, index) => (
                                                        <div className="relative size-full">
                                                            <IconButton sx={{ position: 'absolute', right: 5, bottom: 5, zIndex: 10 }} onClick={() => remove(index)}>
                                                                <Delete />
                                                            </IconButton>
                                                            <MediaUpload
                                                                // eslint-disable-next-line react/no-array-index-key
                                                                key={`${index}:${url}`}
                                                                name={`media.${key}.${index}`}
                                                                label={`${key} media ${index + 1}`}
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
                                                name={`media.${key}.${formik.values.media[key as PrimaryMediaContentType].length}`}
                                                label={`new ${key} media`}
                                                acceptedTypes={['video/mp4', 'image/png', 'image/jpeg', 'image/webp']}
                                            >
                                                {/* This part will never render */}
                                                {() => null}
                                            </MediaUpload>
                                        </div>
                                    )}
                                </FieldArray>

                            ))}
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
                    {Object.keys(ParagraphContentType).map((key) => (
                        <Skeleton key={key}>
                            <TextField
                                variant="standard"
                                fullWidth
                            />
                        </Skeleton>
                    ))}
                </Stack>
            </Paper>
        </Grid2>
    );
}

export default function EditContent() {
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                {Object.keys(PageType).map((page) => (
                    <Suspense fallback={<LoadingPane page={page as PageType} />}>
                        <ContentPane page={page as PageType} />
                    </Suspense>
                ))}
            </Grid2>
        </Container>
    );
}
