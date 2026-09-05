import { createDataPage } from '@/components/createDataPage';
import { pageConfigs } from '@/config/pages';
import { useLogs, useAddLog, useUpdateLog, useDeleteLog } from '@/hooks/useLogs';
import { logFormSchema } from '@/lib/validation';

export const Logs = createDataPage({
    config: pageConfigs.logs,
    schema: logFormSchema,
    useList: useLogs,
    useAdd: useAddLog,
    useUpdate: useUpdateLog,
    useDelete: useDeleteLog,
});