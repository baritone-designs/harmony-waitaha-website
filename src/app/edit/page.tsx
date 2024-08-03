import { prisma } from '@/common/prisma';

export default async function EditRoot() {
    const choruses = await prisma.chorus.findMany();

    return (
        <div className="flex flex-row gap-5">
            {choruses.map((chorus) => (
                <div className="rounded-md bg-slate-900 p-5">
                    <span>{chorus.id}</span>
                </div>
            ))}
        </div>
    );
}
