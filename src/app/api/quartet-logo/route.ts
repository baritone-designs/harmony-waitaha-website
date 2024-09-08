import { nextAuthOptions } from '@/common/auth';
import { prisma } from '@/common/prisma';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import * as yup from 'yup';

/**
 * Function for handling quartet logo uploads using vercel blob storage client api
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
                    allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
                    tokenPayload: clientPayload,
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                try {
                    // Parse tokenPayload to confirm it is a string
                    const quartetId = yup.string().required().validateSync(tokenPayload);

                    // Get the previous icon url of the person whose image is being changed
                    const { logoUrl: previousUrl } = await prisma.quartet.findFirstOrThrow({ where: { id: quartetId }, select: { logoUrl: true } });

                    // Change the iconUrl property for the chosen person
                    await prisma.quartet.update({ where: { id: quartetId }, data: { logoUrl: blob.url } });

                    // Delete the previous icon from blob storage
                    if (previousUrl) {
                        await del(previousUrl);
                    }
                } catch (error) {
                    throw new Error('Could not update quartet');
                }
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 },
        );
    }
}
