import * as yup from 'yup';

const { env: ENV } = process;

/**
 * Schema for validating that the .env file contains the neccesary variables at the start
 */
const EnvironmentSchema = yup.object().shape({
    GOOGLE_CLIENT_ID: yup.string().required(),
    GOOGLE_CLIENT_SECRET: yup.string().required(),
});

/**
 * Instance of loaded env variables
 */
export const env = EnvironmentSchema.validateSync(ENV);
