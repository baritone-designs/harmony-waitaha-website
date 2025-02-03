import { QuartetMembersSchema, SocialsSchema } from '@/common/schema';
import * as yup from 'yup';

declare global {
    namespace PrismaJson {
        type Socials = yup.InferType<typeof SocialsSchema>

        type QuartetMembers = yup.InferType<typeof QuartetMembersSchema>

        type EventLocation = typeof google.maps.places.Place
    }
}

export {};
