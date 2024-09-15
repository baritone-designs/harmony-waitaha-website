import { nextAuthOptions } from '@/common/auth';
import { MAX_IMAGE_SIZE_BYTES } from '@/common/constants';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

/**
 * Handles uploading of images to the vercel storage
 * @param request
 * @returns
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
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
                    maximumSizeInBytes: MAX_IMAGE_SIZE_BYTES,
                    tokenPayload: clientPayload,
                };
            },
            onUploadCompleted: async () => {
                // Get notified of client upload completion
                // ⚠️ This will not work on `localhost` websites,
                // Use ngrok or similar to get the full upload flow
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }, // The webhook will retry 5 times waiting for a 200
        );
    }
}
