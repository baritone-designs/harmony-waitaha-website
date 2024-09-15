import { FormikProps, FormikValues } from 'formik';

export function formikProps<T extends FormikValues>(name: string, formik: FormikProps<T>) {
    const { value, onChange, onBlur } = formik.getFieldProps(name);
    const { error, touched } = formik.getFieldMeta(name);

    return ({
        name,
        value,
        onChange,
        onBlur,
        error: touched && Boolean(error),
        helperText: (touched && error) || ' ',
    });
}
