import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Session } from '@/data/types'

type SessionStore = {
    items: Session[]
    loading: boolean
    error: string | null
    fetchItems: () => Promise<void>
    addItem: (item: Omit<Session, 'id'>) => Promise<void>
    updateItem: (id: string | number, updates: Omit<Session, 'id'>) => Promise<void>
    deleteItem: (id: string | number) => Promise<void>
}

export const useSessionStore = create<SessionStore>((set) => ({
    items: [],
    loading: false,
    error: null,

    fetchItems: async () => {
        console.log('🔍 fetchItems called')
        set({ loading: true, error: null })
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) {
            console.log('❌ No authenticated user')
            set({ loading: false, error: 'Not authenticated' })
            return
        }
        console.log('✅ Authenticated user:', user.user.id)
        const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.user.id)
            .order('startTime', { ascending: false })

        if (error) {
            console.error('❌ fetchItems error:', error)
            set({ error: error.message, loading: false })
            return
        }

        // Ensure endTime is always a string (convert null → '')
        const items = (data || []).map((item: any) => ({
            ...item,
            endTime: item.endTime || '',
        }))
        console.log(`✅ Fetched ${items.length} sessions`, items)
        set({ items, loading: false })
    },

    addItem: async (item) => {
        console.log('➕ addItem called with:', item)
        const { data: user } = await supabase.auth.getUser()
        if (!user.user) {
            console.error('❌ No authenticated user')
            throw new Error('Not authenticated')
        }

        const dbItem = {
            description: item.description,
            category: item.category,
            tags: item.tags || null,
            startTime: item.startTime,
            endTime: item.endTime || null,
            user_id: user.user.id,
        }
        console.log('📤 Inserting:', dbItem)

        const { data, error } = await supabase
            .from('sessions')
            .insert(dbItem)
            .select()
            .single()

        if (error) {
            console.error('❌ addItem error:', error)
            throw error
        }

        const newItem = { ...data, endTime: data.endTime || '' }
        console.log('✅ Added item:', newItem)
        set((state) => ({ items: [newItem, ...state.items] }))
    },

    updateItem: async (id, updates) => {
        const idStr = String(id)
        console.log(`✏️ updateItem called for ID: ${idStr}, updates:`, updates)

        // Build update object, converting empty strings to null for timestamps
        const dbUpdates: any = {}
        if (updates.description !== undefined) dbUpdates.description = updates.description
        if (updates.category !== undefined) dbUpdates.category = updates.category
        if (updates.tags !== undefined) dbUpdates.tags = updates.tags || null
        if (updates.startTime !== undefined) dbUpdates.startTime = updates.startTime
        if (updates.endTime !== undefined) dbUpdates.endTime = updates.endTime || null

        console.log('📤 Updating with:', dbUpdates)

        const { data, error } = await supabase
            .from('sessions')
            .update(dbUpdates)
            .eq('id', idStr)
            .select()
            .single()

        if (error) {
            console.error('❌ updateItem error:', error)
            throw error
        }

        console.log('✅ Updated item returned from Supabase:', data)

        const updatedItem = { ...data, endTime: data.endTime || '' }
        console.log('✅ Mapped updated item:', updatedItem)

        set((state) => {
            const newItems = state.items.map((item) =>
                item.id === idStr ? updatedItem : item
            )
            console.log('📦 New items list:', newItems)
            return { items: newItems }
        })
    },

    deleteItem: async (id) => {
        const idStr = String(id)
        console.log(`🗑️ deleteItem called for ID: ${idStr}`)
        const { error } = await supabase.from('sessions').delete().eq('id', idStr)
        if (error) {
            console.error('❌ deleteItem error:', error)
            throw error
        }
        console.log(`✅ Deleted ID: ${idStr}`)
        set((state) => ({
            items: state.items.filter((item) => item.id !== idStr),
        }))
    },
}))