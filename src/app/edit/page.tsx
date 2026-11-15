import { SITES } from '@/common/sites';
import { redirect } from 'next/navigation';

export default function EditRoot() {
    redirect(`/edit/${SITES[0].slug}`);
}
