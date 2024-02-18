'use client';

import { SignInError } from '@/common/auth';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { FC } from 'react';
import { FaGoogle } from 'react-icons/fa';

interface SignInPageProps {
    searchParams: {
        error?: SignInError;
    };
}

/**
 * Signin page which allows user to sign-in/sign-up (depending on whether the user has already) using one of three OAuth providers
 */
const SignIn: FC<SignInPageProps> = ({ searchParams: { error } }) => {
    const { data } = useSession();

    if (data) {
        redirect('/');
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 pt-20">
            <div className="flex flex-row items-center gap-3">
                <span className="text-2xl">Sign in with</span>
                <button type="button" onClick={() => signIn('google', { callbackUrl: '/' })}><FaGoogle /></button>
            </div>
            {error && <div className="bg-red-700">{error}</div>}
        </div>
    );
};

export default SignIn;
