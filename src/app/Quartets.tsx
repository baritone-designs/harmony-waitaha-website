'use client';

import { Quartet } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { FaGlobe } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { DEFAULT_QUARTET_IMAGE, SOCIALS_ICONS, SOCIALS_PREFIX } from '@/common/constants';
import { m, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import useLocalSearchParam from '@/components/useLocalSearchParam';

function QuartetProfile({ id, name, imageUrl, logoUrl, onClick }: Pick<Quartet, 'id' | 'name' | 'imageUrl' | 'logoUrl'> & { onClick: Function }) {
    return (
        <button
            type="button"
            onClick={() => onClick()}
            style={{
                borderRadius: '24px',
            }}
            className={clsx(
                'relative w-full overflow-hidden bg-hw-white',
                'h-60', // Mobile
                'lg:h-72', // Desktop
            )}
        >
            <m.div
                whileHover={{
                    scale: 1.1,
                    transition: {
                        duration: 0.3,
                        ease: 'easeInOut',
                    },
                }}
                className="absolute inset-0 bg-cover"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url('${imageUrl ?? DEFAULT_QUARTET_IMAGE}')`,
                }}
            />
            <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between px-8 pb-5">
                <span className="text-xl text-hw-white">{name}</span>
                {logoUrl && <Image src={logoUrl} height={20} width={30} alt={`${id}-logo`} className="rounded-full" />}
            </div>
        </button>
    );
}

function SocialsLink({ url, icon: Icon }: { url: string, icon: IconType }) {
    return (
        <Link href={url} target="_blank">
            <Icon size={30} className="text-hw-black duration-200 hover:opacity-50" />
        </Link>
    );
}

function QuartetModal({
    id,
    backgroundImageUrl,
    name,
    biography,
    logoUrl,
    members,
    socials,
    websiteUrl,
    onClick,
}: Pick<Quartet, 'id' | 'name' | 'biography' | 'backgroundImageUrl' | 'logoUrl' | 'members' | 'socials' | 'websiteUrl'> & { onClick: Function }) {
    return (
        <m.div
            initial={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            animate={{ backdropFilter: 'blur(8px) opacity(1)', backgroundColor: 'rgb(0 0 0 / 0.5)' }}
            exit={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            className="fixed inset-0 z-40"
        >
            <button
                type="button"
                onClick={() => onClick()}
                className="absolute inset-0"
            />
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    borderRadius: '24px',
                }}
                className={clsx(
                    'absolute z-50 flex gap-0 overflow-hidden bg-hw-white',
                    'inset-x-5 inset-y-28 flex-col', // Mobile
                    'lg:inset-x-72 lg:inset-y-40 lg:flex-row', // Desktop
                )}
            >
                <div className="relative flex size-full flex-col justify-between pb-6 pl-8 pr-5 pt-5 2xl:w-2/3">
                    <div className="flex flex-col gap-5">
                        <div className="flex w-full max-w-full items-center justify-between">
                            <h1 className="font-poppins text-4xl font-semibold text-hw-black">{name}</h1>
                            {logoUrl && <Image src={logoUrl} height={60} width={60} alt={`${id}-logo`} className="h-14 rounded-full object-cover" />}
                        </div>
                        <div className="flex flex-col gap-2 font-semibold">
                            <span>Tenor: {members.tenor}</span>
                            <span>Lead: {members.lead}</span>
                            <span>Baritone: {members.baritone}</span>
                            <span>Bass: {members.bass}</span>
                        </div>

                        <span>{biography}</span>
                    </div>
                    <div className="mt-5 flex flex-row gap-5">
                        {Object.entries(socials)
                            .map(([key, value]) => value && (
                                <SocialsLink
                                    icon={SOCIALS_ICONS[key as keyof typeof SOCIALS_ICONS]}
                                    url={SOCIALS_PREFIX[key as keyof typeof SOCIALS_PREFIX] + value}
                                />
                            ))}
                        {websiteUrl && <SocialsLink icon={FaGlobe} url={websiteUrl} />}
                    </div>
                </div>
                <div
                    className="h-full bg-cover lg:w-full"
                    style={{
                        backgroundImage: `url('${backgroundImageUrl ?? DEFAULT_QUARTET_IMAGE}')`,
                    }}
                />
            </m.div>
        </m.div>
    );
}

export default function Quartets({ quartets }: { quartets: Quartet[] }) {
    const [id, setId] = useLocalSearchParam('quartet');

    const data = quartets.find((quartet) => quartet.id === id);

    return (
        <>
            <AnimatePresence>
                {data && <QuartetModal {...data} onClick={() => setId(null)} />}
            </AnimatePresence>
            {quartets.map((value) => <QuartetProfile key={value.id} {...value} onClick={() => setId(value.id)} />)}
        </>
    );
}
