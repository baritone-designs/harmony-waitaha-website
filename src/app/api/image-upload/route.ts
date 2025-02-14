import { nextAuthOptions } from '@/common/auth';
import { MAX_IMAGE_SIZE_BYTES, IMAGE_FILE_TYPES } from '@/common/constants';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Handles uploading of images to the vercel storage
 */
export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (
                _pathname,
                clientPayload,
            ) => {
                const user = await getServerSession(nextAuthOptions);

                if (!user) {
                    throw new Error('Not authenticated');
                }

                return {
                    allowedContentTypes: IMAGE_FILE_TYPES,
                    maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
                    tokenPayload: clientPayload,
                };
            },
            onUploadCompleted: async () => {},
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, // The webhook will retry 5 times waiting for a 200
        );
    }
}
