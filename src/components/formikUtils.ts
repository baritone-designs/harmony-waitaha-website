import { FormikProps, FormikValues } from 'formik';

export function formikProps<T extends FormikValues>(name: string, formik: FormikProps<T>, hideErrorWhenEmpty = false) {
    const { value, onChange, onBlur } = formik.getFieldProps(name);
    const { error, touched } = formik.getFieldMeta(name);

    const hasError = touched && Boolean(error) && (!hideErrorWhenEmpty || value);

    return ({
        name,
        value,
        onChange,
        onBlur,
        error: hasError,
        helperText: (hasError && error) || ' ',
    });
}
