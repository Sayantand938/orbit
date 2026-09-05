import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Transaction } from "@/data/types"
import { useAuth } from "@/contexts/AuthContext"

const QUERY_KEY = "transactions"

export function useTransactions() {
    const { user } = useAuth()

    return useQuery({
        queryKey: [QUERY_KEY, user?.id],
        queryFn: async () => {
            if (!user) throw new Error("Not authenticated")
            const { data, error } = await supabase
                .from("transactions")
                .select("*")
                .eq("user_id", user.id)
                .order("event_time", { ascending: false })

            if (error) throw error
            return data as Transaction[]
        },
        enabled: !!user,
    })
}

export function useAddTransaction() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (newItem: Omit<Transaction, "id">) => {
            if (!user) throw new Error("Not authenticated")
            const { data, error } = await supabase
                .from("transactions")
                .insert({ ...newItem, user_id: user.id })
                .select()
                .single()
            if (error) throw error
            return data as Transaction
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}

export function useUpdateTransaction() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string | number; updates: Omit<Transaction, "id"> }) => {
            const idStr = String(id)
            const { data, error } = await supabase
                .from("transactions")
                .update(updates)
                .eq("id", idStr)
                .select()
                .single()
            if (error) throw error
            return data as Transaction
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}

export function useDeleteTransaction() {
    const queryClient = useQueryClient()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (id: string | number) => {
            const idStr = String(id)
            const { error } = await supabase.from("transactions").delete().eq("id", idStr)
            if (error) throw error
            return idStr
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}