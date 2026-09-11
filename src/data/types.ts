export interface Transaction {
    id: string
    description: string
    amount: number
    category: string
    location: string
    tags: string[]
    event_time: string
}

export interface Log {
    id: string
    description: string
    category: string
    tags: string[]
    place: string
    event_time: string
}

export interface Session {
    id: string
    description: string
    category: string
    tags: string[]
    startTime: string
    endTime: string | null
}