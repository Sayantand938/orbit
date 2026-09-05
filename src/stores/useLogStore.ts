import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Log } from '@/data/types'

type LogStore = {
    items: Log[]
    loading: boolean
    error: string | null
    fetchItems: () => Promise<void>
    addItem: (item: Omit<Log, 'id'>) => Promise<void>
    updateItem: (id: string | number, updates: Omit<Log, 'id'>) => Promise<void>
    deleteItem: (id: string | number) => Promise<void>
}

export const useLogStore = create<LogStore>((set) => ({
    items: [],
    loading: false,
    error: null,

    fetchItems: async () => {
        set({ loading: true, error: null })
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) {
            set({ loading: false, error: 'Not authenticated' })
            return
        }
        const { data, error } = await supabase
            .from('logs')
            .select('*')
            .eq('user_id', user.user.id)
            .order('event_time', { ascending: false })
        if (error) {
            set({ error: error.message, loading: false })
            return
        }
        set({ items: data || [], loading: false })
    },

    addItem: async (item) => {
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) throw new Error('Not authenticated')
        const { data, error } = await supabase
            .from('logs')
            .insert({ ...item, user_id: user.user.id })
            .select()
            .single()
        if (error) throw error
        set((state) => ({ items: [data, ...state.items] }))
    },

    updateItem: async (id, updates) => {
        const idStr = String(id)
        const { data, error } = await supabase
            .from('logs')
            .update(updates)
            .eq('id', idStr)
            .select()
            .single()
        if (error) throw error
        set((state) => ({
            items: state.items.map((item) => (item.id === idStr ? data : item)),
        }))
    },

    deleteItem: async (id) => {
        const idStr = String(id)
        const { error } = await supabase.from('logs').delete().eq('id', idStr)
        if (error) throw error
        set((state) => ({
            items: state.items.filter((item) => item.id !== idStr),
        }))
    },
}))