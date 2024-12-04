import { prisma } from '@/common/prisma';
import { MotionDiv, ServerAnimatePresence } from '@/components/Motion';
import { Person } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';

function PersonModal({
    id,
    name,
    biography,
    iconUrl,
}: Pick<Person, 'id' | 'name' | 'biography' | 'iconUrl'>) {
    return (
        <MotionDiv
            key={id}
            initial={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            animate={{ backdropFilter: 'blur(8px)  opacity(1)', backgroundColor: 'rgb(0 0 0 / 0.5)' }}
            exit={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            className="fixed inset-0 z-50 flex h-screen flex-col items-center justify-center"
        >
            <Link href="/qa" scroll={false} className="fixed inset-0" />
            <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative flex w-96 flex-col items-center justify-start gap-5 rounded-3xl bg-qa-blue-dark">
                    {iconUrl && <Image src={iconUrl} height={1000} width={1000} alt={`${id}-logo`} className="h-72 w-full rounded-t-3xl object-cover" />}
                    <div className="flex flex-col gap-2 p-8 pt-3">
                        <h1 className="text-center font-poppins text-4xl font-semibold text-qa-white">{name}</h1>
                        <span className="text-center">{biography}</span>
                    </div>
                </div>
            </MotionDiv>
        </MotionDiv>
    );
}

export default async function PersonLoader({ searchParams }: { searchParams?: Record<string, string> }) {
    const id = searchParams?.person;

    const data = id ? (await prisma.person.findFirst({
        select: {
            id: true,
            name: true,
            biography: true,
            iconUrl: true,
        },
        where: { id },
    })) : null;

    return (
        <ServerAnimatePresence>
            {data && <PersonModal {...data} />}
        </ServerAnimatePresence>
    );
}
