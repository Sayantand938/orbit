import { create, type StoreApi, type UseBoundStore } from 'zustand'

interface DataStore<T extends { id: string | number }> {
    items: T[]
    addItem: (item: Omit<T, 'id'>) => void
    updateItem: (id: string | number, updates: Partial<T>) => void
    deleteItem: (id: string | number) => void
}

export function createDataStore<T extends { id: string | number }>(
    initialData: T[]
): UseBoundStore<StoreApi<DataStore<T>>> {
    return create<DataStore<T>>((set) => ({
        items: initialData,
        addItem: (item) =>
            set((state) => ({
                items: [...state.items, { id: String(Date.now()), ...item } as T],
            })),
        updateItem: (id, updates) =>
            set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, ...updates } : item
                ),
            })),
        deleteItem: (id) =>
            set((state) => ({
                items: state.items.filter((item) => item.id !== id),
            })),
    }))
}