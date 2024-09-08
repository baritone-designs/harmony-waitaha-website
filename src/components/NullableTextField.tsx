import { Field, FieldAttributes, useField } from 'formik';
import { FC } from 'react';
import { FaTrash } from 'react-icons/fa';

export const NullableTextField: FC<FieldAttributes<any>> = ({ type = 'text', ...props }) => {
    const [field, _meta, { setValue }] = useField(props);

    if (field.value === null) {
        return (
            <button type="button" onClick={() => setValue('', false)}>Add {field.name}</button>
        );
    }

    return (
        <div className="flex flex-row items-center justify-between gap-3">
            <Field {...props} type={type} />
            <FaTrash onClick={() => setValue(null)} />
        </div>
    );
};
