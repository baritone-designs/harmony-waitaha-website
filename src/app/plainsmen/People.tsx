'use client';

import { Person } from '@prisma/client';
import Image from 'next/image';
import { m, AnimatePresence } from 'framer-motion';
import useLocalSearchParam from '@/components/useLocalSearchParam';

const PersonProfile = ({ iconUrl, name, role, onClick }: Pick<Person, 'id' | 'iconUrl' | 'name'> & { role: string, onClick: Function }) => (
    <button
        type="button"
        onClick={() => onClick()}
        className="group flex flex-col items-center rounded-3xl border-2 border-transparent p-4 duration-200 hover:opacity-50"
    >
        <div className="size-40 rounded-xl bg-cover bg-center duration-200" style={{ backgroundImage: `url('${iconUrl}')` }} />
        <span className="mt-5 text-lg font-medium duration-200">{name}</span>
        <span className="font-pt-sans text-sm">{role}</span>
    </button>
);

function PersonModal({
    id,
    name,
    biography,
    iconUrl,
    onClick,
}: Pick<Person, 'id' | 'name' | 'biography' | 'iconUrl'> & { onClick: Function }) {
    return (
        <m.div
            initial={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            animate={{ backdropFilter: 'blur(8px)  opacity(1)', backgroundColor: 'rgb(0 0 0 / 0.5)' }}
            exit={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            className="fixed inset-0 z-50 flex h-screen flex-col items-center justify-center"
        >
            <button type="button" onClick={() => onClick()} className="fixed inset-0" />
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative flex w-96 flex-col items-center justify-start gap-5 rounded-xl bg-hw-black">
                    {iconUrl && <Image src={iconUrl} height={1000} width={1000} alt={`${id}-logo`} className="h-72 w-full rounded-t-xl object-cover" />}
                    <div className="flex flex-col gap-2 p-8 pt-3">
                        <h1 className="text-center font-poppins text-4xl font-semibold text-hw-white">{name}</h1>
                        <span className="text-center">{biography}</span>
                    </div>
                </div>
            </m.div>
        </m.div>
    );
}

export default function People({ people }: { people: (Person & { role: string })[] }) {
    const [id, setId] = useLocalSearchParam('person');

    const data = people.find((person) => person.id === id);

    return (
        <>
            <AnimatePresence>
                {data && <PersonModal {...data} onClick={() => setId(null)} />}
            </AnimatePresence>
            {people.map((value) => <PersonProfile key={value.id} {...value} onClick={() => setId(value.id)} />)}
        </>
    );
}
