import { createDataStore } from './createDataStore'
import { initialLogs } from '@/data/mockData'
import { type Log } from '@/data/types'

export const useLogStore = createDataStore<Log>(initialLogs)