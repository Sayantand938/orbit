import { createDataStore } from './createDataStore'
import { initialSessions } from '@/data/mockData'
import { type Session } from '@/data/types'

export const useSessionStore = createDataStore<Session>(initialSessions)