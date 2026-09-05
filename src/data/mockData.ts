import type { Transaction, Log, Session } from './types'

export const initialTransactions: Transaction[] = [
    {
        id: '1',
        description: 'Coffee',
        amount: 4.5,
        category: 'Food & Drink',
        location: 'Starbucks Downtown',
        tags: 'caffeine, morning',
        event_time: '2026-09-04T08:30:00Z',
    },
    {
        id: '2',
        description: 'Lunch',
        amount: 12.0,
        category: 'Food & Drink',
        location: 'Sushi Place',
        tags: 'sushi, work',
        event_time: '2026-09-03T12:15:00Z',
    },
]

export const initialLogs: Log[] = [
    {
        id: '1',
        description: 'System startup',
        category: 'System',
        tags: 'boot, init',
        place: 'Server Room A',
        event_time: '2026-09-04T10:00:00Z',
    },
    {
        id: '2',
        description: 'User login failure',
        category: 'Security',
        tags: 'auth, failed',
        place: 'Office Network',
        event_time: '2026-09-04T09:30:00Z',
    },
]

export const initialSessions: Session[] = [
    {
        id: '1',
        description: 'Development session',
        category: 'Work',               // 👈 added
        tags: 'coding, react',
        startTime: '2026-09-04T09:00:00Z',
        endTime: '2026-09-04T12:30:00Z',
    },
    {
        id: '2',
        description: 'Design review',
        category: 'Meeting',            // 👈 added
        tags: 'design, team',
        startTime: '2026-09-03T14:00:00Z',
        endTime: '2026-09-03T16:00:00Z',
    },
]