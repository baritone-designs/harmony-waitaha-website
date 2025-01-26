'use client';

import { PageContentSchema } from '@/common/schema';
import { trpc } from '@/common/trpc';
import { Button, capitalize, Container, Grid2, Paper, Stack, TextField } from '@mui/material';
import { PageType, ParagraphContentType } from '@prisma/client';
import { Formik } from 'formik';
import { Suspense } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { formikProps } from '@/components/formikUtils';
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
                            {formik.dirty && <Button variant="outlined" onClick={formik.submitForm}>Save</Button>}
                        </Stack>
                    </Paper>
                )}
            </Formik>
        </Grid2>
    );
}

function LoadingPane() {
    return (
        <Grid2 size={4}>
            <Paper />
        </Grid2>
    );
}

export default function EditContent() {
    return (
        <Container sx={{ marginY: 5 }} maxWidth="xl">
            <Grid2 container spacing={2}>
                {Object.keys(PageType).map((page) => (
                    <Suspense fallback={<LoadingPane />}>
                        <ContentPane page={page as PageType} />
                    </Suspense>
                ))}
            </Grid2>
        </Container>
    );
}
