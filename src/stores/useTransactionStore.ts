import { createDataStore } from './createDataStore'
import { initialTransactions } from '@/data/mockData'
import { type Transaction } from '@/data/types'

export const useTransactionStore = createDataStore<Transaction>(initialTransactions)