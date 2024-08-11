'use client';

import { protectedClientPage } from '@/components/protectedClientPage';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

const EditPage = protectedClientPage<PropsWithChildren>(({ user, children }) => (
    <div className="flex flex-row">
        <div className="flex h-screen flex-col justify-between p-5">
            <span>Welcome back {user.name}</span>
            <div className="flex flex-col gap-3">
                <Link href="/edit">Home</Link>
                <Link href="/edit/people">People</Link>
                <Link href="/edit/events">Events</Link>
            </div>
            <button
                type="button"
                onClick={() => {
                    signOut({ callbackUrl: '/' });
                }}
            >
                Sign Out
            </button>
        </div>
        <div className="p-5">
            {children}
        </div>
    </div>
));

export default EditPage;
