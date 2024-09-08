import { FC, ReactNode, useCallback } from 'react';
import { useField } from 'formik';

interface ImageUploadProps {
    name: string;
    acceptedTypes?: string[];
    maxSize?: number;
    existingImageUrl?: string;
    children: (props: { onSelectImage: () => void, imageUrl?: string, error?: string }) => ReactNode;
}

export const ImageUpload: FC<ImageUploadProps> = ({ name, existingImageUrl, acceptedTypes = ['image/png', 'image/jpeg'], maxSize = 4000000, children: Children }) => {
    const [{ value }, { error }, { setValue, setError, setTouched }] = useField<File>(name);

    const handleSelect = useCallback(() => {
        const element = document.createElement('input');
        element.type = 'file';
        element.accept = acceptedTypes.join();

        element.click();
        setTouched(true);

        element.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                return;
            }
            if (!acceptedTypes.includes(file.type)) {
                setError('Unexpected file type');
                return;
            }
            if (file.size > maxSize) {
                setError(`File size cannot be more than than ${(maxSize / 1000000).toFixed(1)} MB`);
                return;
            }

            setValue(file);
        };
    }, [acceptedTypes, maxSize, setError, setTouched, setValue]);

    if (!value && !existingImageUrl) {
        return (
            <button type="button" onClick={handleSelect}>Add {name}</button>
        );
    }

    return <Children onSelectImage={handleSelect} imageUrl={value ? URL.createObjectURL(value) : existingImageUrl} error={error} />;
};
