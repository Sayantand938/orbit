import { createResourceHooks } from "./useResource";
import type { Session } from "@/data/types";

const transformSession = (item: any): Session => ({
    ...item,
    endTime: item.endTime ?? null,
});

const { useList, useAdd, useUpdate, useDelete } = createResourceHooks<Session>(
    "sessions",
    "sessions",
    { column: "startTime", ascending: false },
    transformSession
);

export const useSessions = useList;
export const useAddSession = useAdd;
export const useUpdateSession = useUpdate;
export const useDeleteSession = useDelete;