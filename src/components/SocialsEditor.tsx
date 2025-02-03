import { SOCIALS_PREFIX } from '@/common/constants';
import { InputAdornment } from '@mui/material';
import { FormikProps, FormikValues } from 'formik';
import { formikProps } from './formikUtils';
import { NullableTextField } from './NullableTextField';

interface SocialsEditorProps<T extends FormikValues> {
    fieldName: keyof T;
    formik: FormikProps<T>;
}

export default function SocialsEditor<T extends FormikValues>({ fieldName, formik }: SocialsEditorProps<T>) {
    return (
        <div className="grid grid-cols-2 gap-2 self-stretch">
            {Object.keys(formik.values[fieldName]).map((key) => (
                <NullableTextField
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    sx={{
                                        margin: 0,
                                    }}
                                >
                                    {SOCIALS_PREFIX[key as keyof typeof SOCIALS_PREFIX].substring(8)}
                                </InputAdornment>
                            ),
                        },
                    }}
                    variant="standard"
                    label={key}
                    fullWidth
                    {...formikProps(`${String(fieldName)}.${key}`, formik)}
                />
            ))}
        </div>
    );
}
