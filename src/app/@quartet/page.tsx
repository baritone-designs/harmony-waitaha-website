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
            <Icon size={40} className="text-hw-black duration-200 hover:text-hw-blue" />
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
                className="fixed inset-24 grid grid-cols-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="relative flex flex-col gap-3 rounded-l-xl bg-hw-white p-5">
                    <h1 className="font-poppins text-4xl font-semibold text-hw-black">{name}</h1>
                    {logoUrl && <Image src={logoUrl} height={60} width={60} alt={`${id}-logo`} className="absolute right-5 top-5 rounded-full" />}
                    <span>Tenor: {members.tenor}</span>
                    <span>Lead: {members.lead}</span>
                    <span>Baritone: {members.baritone}</span>
                    <span>Bass: {members.bass}</span>

                    <span>{biography}</span>

                    <div className="absolute inset-x-5 bottom-5 flex flex-row gap-5">
                        {socials.facebook && <SocialsLink icon={FaFacebook} url={`https://facebook.com/${socials.facebook}`} />}
                        {socials.x && <SocialsLink icon={FaTwitter} url={`https://x.com/${socials.x}`} />}
                        {socials.instagram && <SocialsLink icon={FaInstagram} url={`https://instagram.com/${socials.instagram}`} />}
                        {socials.youtube && <SocialsLink icon={FaYoutubeSquare} url={`https://youtube.com/@${socials.youtube}`} />}
                        {websiteUrl && <SocialsLink icon={FaGlobe} url={websiteUrl} />}
                    </div>
                </div>
                <div
                    className="col-span-2 rounded-r-xl"
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
