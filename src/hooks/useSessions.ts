import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Session } from "@/data/types"
import { useAuth } from "@/contexts/AuthContext"

const QUERY_KEY = "sessions"

export function useSessions() {
    const { user } = useAuth()
    return useQuery({
        queryKey: [QUERY_KEY, user?.id],
        queryFn: async () => {
            if (!user) throw new Error("Not authenticated")
            const { data, error } = await supabase
                .from("sessions")
                .select("*")
                .eq("user_id", user.id)
                .order("startTime", { ascending: false })
            if (error) throw error
            // Ensure endTime is always a string (convert null → '')
            const items = (data || []).map((item: any) => ({
                ...item,
                endTime: item.endTime || "",
            }))
            return items as Session[]
        },
        enabled: !!user,
    })
}

export function useAddSession() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async (newItem: Omit<Session, "id">) => {
            if (!user) throw new Error("Not authenticated")
            const dbItem = {
                description: newItem.description,
                category: newItem.category,
                tags: newItem.tags || null,
                startTime: newItem.startTime,
                endTime: newItem.endTime || null,
                user_id: user.id,
            }
            const { data, error } = await supabase
                .from("sessions")
                .insert(dbItem)
                .select()
                .single()
            if (error) throw error
            return { ...data, endTime: data.endTime || "" } as Session
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}

export function useUpdateSession() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async ({ id, updates }: { id: string | number; updates: Omit<Session, "id"> }) => {
            const idStr = String(id)
            const dbUpdates: any = {}
            if (updates.description !== undefined) dbUpdates.description = updates.description
            if (updates.category !== undefined) dbUpdates.category = updates.category
            if (updates.tags !== undefined) dbUpdates.tags = updates.tags || null
            if (updates.startTime !== undefined) dbUpdates.startTime = updates.startTime
            if (updates.endTime !== undefined) dbUpdates.endTime = updates.endTime || null

            const { data, error } = await supabase
                .from("sessions")
                .update(dbUpdates)
                .eq("id", idStr)
                .select()
                .single()
            if (error) throw error
            return { ...data, endTime: data.endTime || "" } as Session
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}

export function useDeleteSession() {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    return useMutation({
        mutationFn: async (id: string | number) => {
            const idStr = String(id)
            const { error } = await supabase.from("sessions").delete().eq("id", idStr)
            if (error) throw error
            return idStr
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] })
        },
    })
}