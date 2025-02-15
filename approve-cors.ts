import { env } from '@/common/environment';
import { Storage } from '@google-cloud/storage';

/**
 * Adds the current server URL to the approved origins in the google cloud storage bucket CORS configuration
 */
async function configureBucketCors() {
    const storage = new Storage({
        projectId: env.GCLOUD_PROJECT_ID,
        credentials: {
            client_email: env.GCLOUD_CLIENT_EMAIL,
            private_key: env.GCLOUD_PRIVATE_KEY.split(String.raw`\n`).join('\n'), // Needed to fix decoder runtime error
        },
    });

    const bucket = storage.bucket(env.STORAGE_BUCKET_NAME);

    const [metadata] = await bucket.getMetadata();

    const existingCors = metadata.cors?.[0];

    if (!existingCors?.origin?.includes(env.NEXTAUTH_URL)) {
        await bucket.setCorsConfiguration([{
            origin: Array.from(new Set([...(existingCors?.origin ?? []), env.NEXTAUTH_URL])),
            method: ['POST'],
            responseHeader: ['Content-Type'],
            maxAgeSeconds: 3600,
        }]);
    }
}

configureBucketCors().then(() => console.log(`Successfully approved ${env.NEXTAUTH_URL} for cloud storage CORS`)).catch(console.error);
