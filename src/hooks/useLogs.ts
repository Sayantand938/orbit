import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Log } from "@/data/types"
import { useAuth } from "@/contexts/AuthContext"

const QUERY_KEY = "logs"

export function useLogs() {
    const { user } = useAuth()
    return useQuery({
        queryKey: [QUERY_KEY, user?.id],
        queryFn: async () => {
            if (!user) throw new Error("Not authenticated")
            const { data, error } = await supabase
                .from("logs")
                .select("*")
                .eq("user_id", user.id)
                .order("event_time", { ascending: false })
            if (error) throw error
            return data as Log[]
        },
        enabled: !!user,
    })
}

export function useAddLog() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async (newItem: Omit<Log, "id">) => {
            if (!user) throw new Error("Not authenticated")
            const { data, error } = await supabase
                .from("logs")
                .insert({ ...newItem, user_id: user.id })
                .select()
                .single()
            if (error) throw error
            return data as Log
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}

export function useUpdateLog() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string | number; updates: Omit<Log, "id"> }) => {
            const idStr = String(id)
            const { data, error } = await supabase
                .from("logs")
                .update(updates)
                .eq("id", idStr)
                .select()
                .single()
            if (error) throw error
            return data as Log
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}

export function useDeleteLog() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async (id: string | number) => {
            const idStr = String(id)
            const { error } = await supabase.from("logs").delete().eq("id", idStr)
            if (error) throw error
            return idStr
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}