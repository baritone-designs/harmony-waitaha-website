'use client';

import { FC } from 'react';
import { useField } from 'formik';
import Datetime from 'react-datetime';

/**
 * Text field component which handles showing of errors from Formik context
 */
export const DateTimeField: FC<{ name: string }> = ({ ...props }) => {
    const [field, _meta, { setValue }] = useField(props);

    return (
        <Datetime
            value={field.value}
            onChange={(e) => {
                if (typeof e !== 'string') {
                    setValue(e.toDate());
                }
            }}
        />
    );
};
