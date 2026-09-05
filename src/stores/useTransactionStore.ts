import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { type Transaction } from '@/data/types'

type TransactionStore = {
    items: Transaction[]
    loading: boolean
    error: string | null
    fetchItems: () => Promise<void>
    addItem: (item: Omit<Transaction, 'id'>) => Promise<void>
    updateItem: (id: string, updates: Omit<Transaction, 'id'>) => Promise<void>
    deleteItem: (id: string) => Promise<void>
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
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
            .from('transactions')
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
            .from('transactions')
            .insert({ ...item, user_id: user.user.id })
            .select()
            .single()
        if (error) throw error
        set((state) => ({ items: [data, ...state.items] }))
    },

    updateItem: async (id, updates) => {
        const { data, error } = await supabase
            .from('transactions')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
        if (error) throw error
        set((state) => ({
            items: state.items.map((item) => (item.id === id ? data : item)),
        }))
    },

    deleteItem: async (id) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id)
        if (error) throw error
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        }))
    },
}))