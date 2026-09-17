import Dexie, { type Table } from "dexie"

interface KeyVal {
    key: string
    value: string
}

/**
 * Orbit's IndexedDB database.
 *
 * Currently a single keyval table used as a Zustand persist backend.
 * When we move to Supabase, the outbox queue and any local session
 * tables will be added as new tables via a version bump.
 */
class OrbitDB extends Dexie {
    keyval!: Table<KeyVal, string>

    constructor() {
        super("orbit")
        this.version(1).stores({
            keyval: "key",
        })
    }
}

export const db = new OrbitDB()