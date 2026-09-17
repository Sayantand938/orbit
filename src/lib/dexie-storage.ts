import type { StateStorage } from "zustand/middleware"
import { db } from "@/lib/db"

/**
 * Zustand `StateStorage` backed by IndexedDB via Dexie.
 *
 * Zustand serializes to a string before calling setItem, so this is a
 * drop-in replacement for the default localStorage adapter. The
 * difference is that IndexedDB has a much larger quota and survives
 * eviction far better than localStorage.
 *
 * Because getItem is async, persist hydration becomes async. Stores
 * using this adapter should set `skipHydration: true` and call
 * `useStore.persist.rehydrate()` before rendering.
 */
export const dexieStorage: StateStorage = {
    getItem: async (name) => {
        const row = await db.keyval.get(name)
        return row?.value ?? null
    },
    setItem: async (name, value) => {
        await db.keyval.put({ key: name, value })
    },
    removeItem: async (name) => {
        await db.keyval.delete(name)
    },
}