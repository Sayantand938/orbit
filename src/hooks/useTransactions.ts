import { createResourceHooks } from "./useResource";
import type { Transaction } from "@/data/types";

const { useList, useAdd, useUpdate, useDelete } = createResourceHooks<Transaction>(
    "transactions",
    "transactions",
    { column: "event_time", ascending: false }
);

export const useTransactions = useList;
export const useAddTransaction = useAdd;
export const useUpdateTransaction = useUpdate;
export const useDeleteTransaction = useDelete;