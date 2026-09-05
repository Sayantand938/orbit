import { createDataPage } from '@/components/createDataPage';
import { pageConfigs } from '@/config/pages';
import {
    useSessions,
    useAddSession,
    useUpdateSession,
    useDeleteSession,
} from '@/hooks/useSessions';
import { sessionFormSchema } from '@/lib/validation';

export const Sessions = createDataPage({
    config: pageConfigs.sessions,
    schema: sessionFormSchema,
    useList: useSessions,
    useAdd: useAddSession,
    useUpdate: useUpdateSession,
    useDelete: useDeleteSession,
});