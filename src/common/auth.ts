import { NextAuthOptions } from 'next-auth';

export const nextAuthOptions: NextAuthOptions = {
    providers: [

    ],
    callbacks: {
        // Needed for some reason
        session: ({ user, session }) => {
            session.user = user;

            return session;
        },
    },
    session: {
        strategy: 'database',
    },
    pages: {
        signIn: '/sign-in',
        newUser: '/',
    },
};
