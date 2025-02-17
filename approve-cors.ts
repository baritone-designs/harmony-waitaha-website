import { env } from '@/common/environment';
import { Storage } from '@google-cloud/storage';

const ALL_URLS = new Set([
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
    ...(process.env.NEXTAUTH_URL ? [process.env.NEXTAUTH_URL] : []), // Nextauth url contains http(s):// prefix
]);

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

    const existingOrigins = new Set(metadata.cors?.[0].origin ?? []);

    if (!existingOrigins.isSupersetOf(ALL_URLS)) {
        await bucket.setCorsConfiguration([{
            origin: Array.from(existingOrigins.union(ALL_URLS)),
            method: ['POST'],
            responseHeader: ['Content-Type'],
            maxAgeSeconds: 3600,
        }]);
    }
}

configureBucketCors().then(() => console.log(`Successfully approved ${Array.from(ALL_URLS).join(', ')} for cloud storage CORS`)).catch(console.error);
