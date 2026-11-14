import { SOCIALS_PREFIX } from '@/common/constants';
import { InputAdornment } from '@mui/material';
import { FormikProps, FormikValues, getIn } from 'formik';
import { formikProps } from './formikUtils';
import { NullableTextField } from './NullableTextField';

interface SocialsEditorProps<T extends FormikValues> {
    /** Path to the socials object, may be nested e.g. `chorus.socials` */
    fieldName: string;
    formik: FormikProps<T>;
}

export default function SocialsEditor<T extends FormikValues>({ fieldName, formik }: SocialsEditorProps<T>) {
    return (
        <div className="grid grid-cols-2 gap-2 self-stretch">
            {Object.keys(getIn(formik.values, fieldName)).map((key) => (
                <NullableTextField
                    key={key}
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
                    {...formikProps(`${fieldName}.${key}`, formik)}
                />
            ))}
        </div>
    );
}
