import { createResourceHooks } from "./useResource";
import type { Log } from "@/data/types";

const { useList, useAdd, useUpdate, useDelete } = createResourceHooks<Log>(
    "logs",
    "logs",
    { column: "event_time", ascending: false }
);

export const useLogs = useList;
export const useAddLog = useAdd;
export const useUpdateLog = useUpdate;
export const useDeleteLog = useDelete;