import { QuartetMembersSchema, QuartetSocialsSchema } from '@/common/schema';
import * as yup from 'yup';

declare global {
    namespace PrismaJson {
        type QuartetSocials = yup.InferType<typeof QuartetSocialsSchema>

        type QuartetMembers = yup.InferType<typeof QuartetMembersSchema>

        type EventLocation = typeof google.maps.places.Place
    }
}

export {};
