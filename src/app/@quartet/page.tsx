import { prisma } from '@/common/prisma';
import { MotionDiv, ServerAnimatePresence } from '@/components/Motion';
import { Quartet } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import * as yup from 'yup';
import { FaFacebook, FaGlobe, FaInstagram, FaTwitter, FaYoutubeSquare } from 'react-icons/fa';
import { IconType } from 'react-icons';

const MembersStructure = yup.object().shape({
    tenor: yup.string().required(),
    lead: yup.string().required(),
    baritone: yup.string().required(),
    bass: yup.string().required(),
});

const SocialsStructure = yup.object().shape({
    x: yup.string(),
    facebook: yup.string(),
    instagram: yup.string(),
    youtube: yup.string(),
});

function SocialsLink({ url, icon: Icon }: { url: string, icon: IconType }) {
    return (
        <Link href={url} target="_blank">
            <Icon size={40} className="text-hw-black duration-200 hover:text-hw-blue" />
        </Link>
    );
}

function QuartetModal(quartet: Quartet) {
    const members = MembersStructure.validateSync(quartet.members);
    const socials = SocialsStructure.validateSync(quartet.socials);

    return (
        <MotionDiv
            key={quartet.id}
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
                    <h1 className="font-poppins text-4xl font-semibold text-hw-black">{quartet.name}</h1>
                    {quartet.logoUrl && <Image src={quartet.logoUrl} height={60} width={60} alt={`${quartet.id}-logo`} className="absolute right-5 top-5 rounded-full" />}
                    <span>Tenor: {members.tenor}</span>
                    <span>Lead: {members.lead}</span>
                    <span>Baritone: {members.baritone}</span>
                    <span>Bass: {members.bass}</span>

                    <span>{quartet.biography}</span>

                    <div className="absolute inset-x-5 bottom-5 flex flex-row gap-5">
                        {socials.facebook && <SocialsLink icon={FaFacebook} url={`https://facebook.com/${socials.facebook}`} />}
                        {socials.x && <SocialsLink icon={FaTwitter} url={`https://x.com/${socials.x}`} />}
                        {socials.instagram && <SocialsLink icon={FaInstagram} url={`https://instagram.com/${socials.instagram}`} />}
                        {socials.youtube && <SocialsLink icon={FaYoutubeSquare} url={`https://youtube.com/@${socials.youtube}`} />}
                        {quartet.websiteUrl && <SocialsLink icon={FaGlobe} url={quartet.websiteUrl} />}
                    </div>
                </div>
                <div
                    className="col-span-2 rounded-r-xl"
                    style={{
                        backgroundImage: `url('${quartet.backgroundImageUrl ?? 'defaultqt-photo.png'}')`,
                    }}
                />
            </MotionDiv>
        </MotionDiv>
    );
}

export default async function QuartetLoader({ searchParams }: { searchParams?: Record<string, string> }) {
    const id = searchParams?.quartet;

    const data = id ? (await prisma.quartet.findFirst({ where: { id } })) : null;

    return (
        <ServerAnimatePresence>
            {data && <QuartetModal {...data} />}
        </ServerAnimatePresence>
    );
}
