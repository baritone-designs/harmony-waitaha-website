'use client';

import { Button, IconButton, TextField } from '@mui/material';
import { FieldAttributes, useField } from 'formik';
import { AnimatePresence, m } from 'framer-motion';
import { FC } from 'react';
import { FaTrash } from 'react-icons/fa';

export const NullableTextField: FC<FieldAttributes<any>> = (props) => {
    const [field, _meta, { setValue }] = useField(props);

    const buttonVariants = {
        show: { clipPath: 'inset(0)' },
        hide: { clipPath: 'inset(100% 0 0 0)' },
    };

    const fieldVariants = {
        show: { clipPath: 'inset(0)' },
        hide: { clipPath: 'inset(0 0 0 100%)' },
    };

    return (
        <div className="relative">
            <AnimatePresence>
                <m.div
                    key="add-button"
                    variants={buttonVariants}
                    initial={false}
                    animate={field.value === null ? 'show' : 'hide'}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Button type="button" onClick={() => setValue('', false)}>
                        Add
                        {' '}
                        {props.label ?? field.name}
                    </Button>
                </m.div>
                <m.div
                    key="field"
                    variants={fieldVariants}
                    initial={false}
                    animate={field.value === null ? 'hide' : 'show'}
                    className="flex flex-row items-center justify-between gap-3"
                >
                    {/* null means "not set" (shows the Add button); inputs can't take null */}
                    <TextField {...props} value={field.value ?? ''} />
                    <IconButton size="large" onClick={() => setValue(null)}><FaTrash size={15} /></IconButton>
                </m.div>
            </AnimatePresence>
        </div>
    );
};
