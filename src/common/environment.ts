import * as yup from 'yup';

// Needed for side scripts such as 'approve-cors.ts'
require('dotenv').config();

const { env: ENV } = process;

/**
 * Schema for validating that the .env file contains the neccesary variables at the start
 *
 * Check [`Vercel Settings`](https://vercel.com/baritone-designs/harmony-waitaha/settings/environment-variables) for the values except where stated otherwise below
 */
const EnvironmentSchema = yup.object().shape({
    /**
     * The URL of the server, this will be used for redirection during authentication with 3rd parties.
     *
     * This is required to run the server locally, but not in production
     *
     * Example: `http://localhost:3000`
     */
    NEXTAUTH_URL: yup.string(),

    /**
     * Can be anything, but preferably some long random string
     */
    NEXTAUTH_SECRET: yup.string().required(),

    /**
     * Url of the postgres database
     * Use format: `postgresql://<username>:<password>@localhost:<port>/<database-name>`
     * Please use a local running postgres database we do not have a hosted development database
     */
    DATABASE_URL: yup.string().required(),
    /**
     * Same as DATABASE_URL for local development purposes
     */
    DATABASE_URL_UNPOOLED: yup.string().required(),
    /**
     * Url of a shadow postgres database (must be different to DATABASE_URL)
     *
     * This database must be empty and is used when applying prisma migrations
     */
    SHADOW_DATABASE_URL_UNPOOLED: yup.string().required(),

    /**
     * ID of the google cloud credential for OAuth
     */
    GOOGLE_OAUTH_CLIENT_ID: yup.string().required(),
    /**
     * Secret of the google cloud credential for OAuth
     */
    GOOGLE_OAUTH_CLIENT_SECRET: yup.string().required(),

    GCLOUD_PROJECT_ID: yup.string().required(),
    GCLOUD_CLIENT_EMAIL: yup.string().required(),
    GCLOUD_PRIVATE_KEY: yup.string().required(),
    STORAGE_BUCKET_NAME: yup.string().required(),

    /**
     * Whitelist of comma seperated email adresses allowed to sign in. Add your email to this to override the database list
     *
     * (Not required)
     */
    WHITELISTED_EMAILS: yup.string(),

    /**
     * Token for google maps api
     */
    NEXT_PUBLIC_GOOGLE_MAP_API: yup.string().required(),
});

/**
 * Instance of loaded env variables
 *
 * ! This should NOT be imported client side as the compiler will not automatically include environment variables unless they are directly accessed through `process.env`
 */
export const env = EnvironmentSchema.validateSync(ENV);
