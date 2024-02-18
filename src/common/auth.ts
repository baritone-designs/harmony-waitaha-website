import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { env } from './environment';
import { prisma } from './prisma';

export enum SignInError {
    OAuthAccountNotLinked = 'OAuthAccountNotLinked',
    OAuthSignIn = 'OAuthSignin',
    OAuthCallback = 'OAuthCallback',
    EmailNotWhitelisted = 'EmailNotWhitelisted'
}

export const nextAuthOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            id: 'google',
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // Needed for some reason
        session({ user, session }) {
            session.user = user;

            return session;
        },
        async signIn({ user }) {
            if (!await prisma.whitelistedEmail.findFirst({
                where: {
                    email: user.email,
                },
            }) && !env.WHITELISTED_EMAILS?.split(',').map((x) => x.trim())?.includes(user.email)) {
                // Users email has not been whitelisted, they are not allowed to sign in
                throw new Error(SignInError.EmailNotWhitelisted);
            }

            return true;
        },
    },
    session: {
        strategy: 'database',
    },
    pages: {
        signIn: '/auth/sign-in',
        error: '/auth/sign-in',
        newUser: '/',
    },
};
