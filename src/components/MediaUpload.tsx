import { FC, ReactNode, useCallback, useState } from 'react';
import { useField } from 'formik';
import { Button, CircularProgress } from '@mui/material';
import { MAX_IMAGE_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES, IMAGE_FILE_TYPES, IMAGE_FORMAT_MAPS, VIDEO_FILE_TYPES, VIDEO_FORMAT_MAPS } from '@/common/constants';
import { toast } from 'react-toastify';
import uploadFile from './uploadFile';

interface MediaUploadProps {
    name: string;
    label?: string;
    acceptedTypes: (typeof IMAGE_FILE_TYPES[number] | typeof VIDEO_FILE_TYPES[number])[];
    children: (props: { src: string }) => ReactNode;
}

/**
 * Handles uploading of images to a Formik Form using the image URL as the field value
 *
 * This component will manage the process of uploading to the blob storage, and then set the URL as the field value
 * @param param0
 * @returns
 */
export const MediaUpload: FC<MediaUploadProps> = ({ name, label, acceptedTypes, children: Children }) => {
    const [{ value }, { error, touched }, { setValue, setTouched }] = useField<string | undefined | null>(name);

    const [uploading, setUploading] = useState(false);

    const hasError = touched && error && !uploading;

    const handleSelect = useCallback(() => {
        const element = document.createElement('input');
        element.type = 'file';
        element.accept = acceptedTypes.join();

        element.click();

        element.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];

            if (!file) {
                return;
            }

            if (!(acceptedTypes as string[]).includes(file.type)) {
                toast.error(`Unexpected file type: ${file.type}, must be one of: ${acceptedTypes.join(', ')}`);
                return;
            }

            const validFileEndings = { ...IMAGE_FORMAT_MAPS, ...VIDEO_FORMAT_MAPS }[file.type]!;

            if (!validFileEndings.some((ending) => file.name.toLowerCase().endsWith(ending))) {
                toast.error(`File of type ${file.type} must end with one of: ${validFileEndings.join(', ')}`);
                return;
            }

            const isVideo = (VIDEO_FILE_TYPES as string[]).includes(file.type);

            const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

            if (file.size > maxSize) {
                toast.error(`File size cannot be more than than ${(maxSize / 1e6).toFixed(1)} MB`);
                return;
            }

            setTouched(true);
            setUploading(true);

            try {
                const url = await uploadFile(file);

                setValue(url);
            } catch (e) {
                toast.error((e as Error).toString());
            } finally {
                setUploading(false);
            }
        };
    }, [acceptedTypes, setTouched, setValue]);

    return (
        <div className="flex flex-col items-center gap-1">
            {uploading ? <CircularProgress /> : value ? (
                <button className="group relative self-center" type="button" onClick={handleSelect}>
                    <Children src={value} />
                    <span className="absolute left-1/2 top-1/2 w-max -translate-x-1/2 -translate-y-1/2 opacity-0 duration-200 group-hover:opacity-100">Change {label}</span>
                </button>
            ) : <Button type="button" onClick={handleSelect} color={hasError ? 'error' : undefined} variant="outlined">Upload {label ?? name}</Button>}
            <span className="text-xs text-red-500">{hasError ? error : ' '}</span>
        </div>
    );
};
