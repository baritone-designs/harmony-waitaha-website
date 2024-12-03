import { prisma } from '@/common/prisma';
import { MotionDiv, ServerAnimatePresence } from '@/components/Motion';
import { Quartet } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaGlobe, FaInstagram, FaTwitter, FaYoutubeSquare } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { DEFAULT_QUARTET_IMAGE } from '@/common/constants';

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
}: Pick<Quartet, 'id' | 'name' | 'biography' | 'backgroundImageUrl' | 'logoUrl' | 'members' | 'socials' | 'websiteUrl'>) {
    return (
        <MotionDiv
            key={id}
            initial={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            animate={{ backdropFilter: 'blur(8px)  opacity(1)', backgroundColor: 'rgb(0 0 0 / 0.5)' }}
            exit={{ backdropFilter: 'blur(12px) opacity(0)', backgroundColor: 'rgb(0 0 0 / 0)' }}
            className="fixed inset-0 z-20"
        >
            <Link href="/" scroll={false} className="fixed inset-0" />
            <MotionDiv
                className="fixed inset-x-5 inset-y-28 flex flex-col gap-0 lg:inset-x-72 lg:inset-y-40 lg:flex-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative flex h-full w-full flex-col justify-between rounded-t-3xl bg-hw-white pb-6 pl-8 pr-5 pt-5 lg:rounded-none lg:rounded-l-3xl 2xl:w-2/3">
                    <div className="flex flex-col gap-5">
                        <div className="flex w-full max-w-full items-center justify-between">
                            <h1 className="font-poppins text-4xl font-semibold text-hw-black">{name}</h1>
                            {logoUrl && <Image src={logoUrl} height={60} width={60} alt={`${id}-logo`} className="h-14 rounded-full border-2 object-cover" />}
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
                        {socials.facebook && <SocialsLink icon={FaFacebook} url={`https://facebook.com/${socials.facebook}`} />}
                        {socials.x && <SocialsLink icon={FaTwitter} url={`https://x.com/${socials.x}`} />}
                        {socials.instagram && <SocialsLink icon={FaInstagram} url={`https://instagram.com/${socials.instagram}`} />}
                        {socials.youtube && <SocialsLink icon={FaYoutubeSquare} url={`https://youtube.com/@${socials.youtube}`} />}
                        {websiteUrl && <SocialsLink icon={FaGlobe} url={websiteUrl} />}
                    </div>
                </div>
                <div
                    className="aspect-video h-full rounded-b-3xl bg-cover bg-center lg:aspect-auto lg:w-full lg:rounded-none lg:rounded-r-3xl"
                    style={{
                        backgroundImage: `url('${backgroundImageUrl ?? DEFAULT_QUARTET_IMAGE}')`,
                    }}
                />
            </MotionDiv>
        </MotionDiv>
    );
}

export default async function QuartetLoader({ searchParams }: { searchParams?: Record<string, string> }) {
    const id = searchParams?.quartet;

    const data = id ? (await prisma.quartet.findFirst({
        select: {
            id: true,
            name: true,
            biography: true,
            backgroundImageUrl: true,
            logoUrl: true,
            members: true,
            socials: true,
            websiteUrl: true,
        },
        where: { id },
    })) : null;

    return (
        <ServerAnimatePresence>
            {data && <QuartetModal {...data} />}
        </ServerAnimatePresence>
    );
}
