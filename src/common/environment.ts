import * as yup from 'yup';

const { env: ENV } = process;

/**
 * Schema for validating that the .env file contains the neccesary variables at the start
 *
 * Check [`Vercel Settings`](https://vercel.com/baritone-designs/harmony-waitaha/settings/environment-variables) for the values except where stated otherwise below
 */
const EnvironmentSchema = yup.object().shape({
    /**
     * URL of the website, required for redirects from login providers
     */
    NEXTAUTH_URL: yup.string().required(),
    /**
     * Can be anything, but preferably some long random string
     */
    NEXTAUTH_SECRET: yup.string().required(),

    /**
     * Url of the postgres database
     * Use format: `postgresql://<username>:<password>@localhost:<port>/<database-name>`
     * Please use a local running postgres database we do not have a hosted development database
     */
    DATABASE_PRISMA_URL: yup.string().required(),
    /**
     * Same as DATABASE_URL_NON_POOLING
     */
    DATABASE_URL_NON_POOLING: yup.string().required(),
    /**
     * ID of the google cloud credential for OAuth
     */
    GOOGLE_CLIENT_ID: yup.string().required(),
    /**
     * Secret of the google cloud credential for OAuth
     */
    GOOGLE_CLIENT_SECRET: yup.string().required(),

    /**
     * Whitelist of comma seperated email adresses allowed to sign in. Add your email to this to override the database list
     *
     * (Not required)
     */
    WHITELISTED_EMAILS: yup.string(),

    /**
     * Token for the Vercel BLOB (binary large object) storage.
     */
    BLOB_READ_WRITE_TOKEN: yup.string().required(),
    /**
     * Token for google maps api
     */
    NEXT_PUBLIC_GOOGLE_MAP_API: yup.string().required(),
});

/**
 * Instance of loaded env variables
 */
export const env = EnvironmentSchema.validateSync(ENV);
