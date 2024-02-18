'use client';

import { protectedClientPage } from '@/components/protectedClientPage';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

const EditPage = protectedClientPage(({ user }) => (
    <div>
        Welcome back {user.email}

        <button
            type="button"
            onClick={async () => {
                await signOut();

                redirect('/');
            }}
        >Logout
        </button>
    </div>
));

export default EditPage;
