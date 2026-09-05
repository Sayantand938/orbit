export * from './types'

// Import the individual configs
import { transactionsConfig } from './transactions'
import { logsConfig } from './logs'
import { sessionsConfig } from './sessions'

// Re-export them so they can be imported directly from '@config/pages'
export { transactionsConfig, logsConfig, sessionsConfig }

// Combine into a single object like the original pageConfigs
export const pageConfigs = {
    transactions: transactionsConfig,
    logs: logsConfig,
    sessions: sessionsConfig,
} as const

// Type helpers
export type PageKey = keyof typeof pageConfigs
export type PageConfigType<T> = import('./types').PageConfig<T>