import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type Resource = { id: string | number;[key: string]: any };

export function createResourceHooks<T extends Resource>(
    tableName: string,
    queryKey: string,
    orderBy?: { column: string; ascending?: boolean },
    transform?: (item: any) => T
) {
    const useList = () => {
        const { user } = useAuth();
        return useQuery({
            queryKey: [queryKey, user?.id],
            queryFn: async () => {
                if (!user) throw new Error("Not authenticated");
                let query = supabase.from(tableName).select("*").eq("user_id", user.id);
                if (orderBy) {
                    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
                }
                const { data, error } = await query;
                if (error) throw error;
                return (data || []).map((item: any) => (transform ? transform(item) : item)) as T[];
            },
            enabled: !!user,
        });
    };

    const useAdd = () => {
        const { user } = useAuth();
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (newItem: Omit<T, "id">) => {
                if (!user) throw new Error("Not authenticated");
                const { data, error } = await supabase
                    .from(tableName)
                    .insert({ ...newItem, user_id: user.id } as any)
                    .select()
                    .single();
                if (error) throw error;
                return transform ? transform(data) : data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [queryKey, user?.id] });
            },
        });
    };

    const useUpdate = () => {
        const { user } = useAuth();
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async ({
                id,
                updates,
            }: {
                id: string | number;
                updates: Omit<T, "id">;
            }) => {
                if (!user) throw new Error("Not authenticated");
                const idStr = String(id);
                const { data, error } = await supabase
                    .from(tableName)
                    .update(updates as any)
                    .eq("id", idStr)
                    .select()
                    .single();
                if (error) throw error;
                return transform ? transform(data) : data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [queryKey, user?.id] });
            },
        });
    };

    const useDelete = () => {
        const { user } = useAuth();
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (id: string | number) => {
                if (!user) throw new Error("Not authenticated");
                const idStr = String(id);
                const { error } = await supabase.from(tableName).delete().eq("id", idStr);
                if (error) throw error;
                return idStr;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [queryKey, user?.id] });
            },
        });
    };

    return { useList, useAdd, useUpdate, useDelete };
}