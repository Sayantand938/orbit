export * from './types';

import { transactionsConfig } from './transactions';
import { logsConfig } from './logs';
import { sessionsConfig } from './sessions';

export { transactionsConfig, logsConfig, sessionsConfig };

export const pageConfigs = {
    transactions: transactionsConfig,
    logs: logsConfig,
    sessions: sessionsConfig,
} as const;