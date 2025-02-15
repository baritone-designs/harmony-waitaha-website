import { trpc } from '@/common/trpc';

export default async function uploadFile(file: File) {
    const [{ url, fields }, publicUrl] = await trpc.client.content.getMediaUploadUrl.query(file.name);

    const body = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => body.append(key, value));

    const upload = await fetch(url, {
        method: 'POST',
        body,
    });

    if (!upload.ok) throw new Error('Error while uploading file');

    return publicUrl;
}
