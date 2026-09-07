import { useState } from "react"
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"

import { useSessionSummary } from "./hooks/useSessionSummary"
import { useTransactionSummary } from "./hooks/useTransactionSummary"
import { SessionSummary } from "./components/SessionSummary"
import { TransactionSummary } from "./components/TransactionSummary"

export function Dashboard() {
    const today = new Date()

    // Session range (default: today)
    const [sessionRange, setSessionRange] = useState<DateRange | undefined>({
        from: startOfDay(today),
        to: endOfDay(today),
    })
    const sessionData = useSessionSummary(sessionRange)

    // Transaction range (default: this month)
    const [txRange, setTxRange] = useState<DateRange | undefined>({
        from: startOfMonth(today),
        to: endOfMonth(today),
    })
    const txData = useTransactionSummary(txRange)

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <SessionSummary
                range={sessionRange}
                setRange={setSessionRange}
                entries={sessionData.entries}
                totalMinutes={sessionData.totalMinutes}
                isLoading={sessionData.isLoading}
            />

            <TransactionSummary
                range={txRange}
                setRange={setTxRange}
                entries={txData.entries}
                totalEarned={txData.totalEarned}
                totalSpent={txData.totalSpent}
                netBalance={txData.netBalance}
                isLoading={txData.isLoading}
            />
        </div>
    )
}