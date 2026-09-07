import { useMemo } from "react"
import { startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { useTransactions } from "@/hooks/useTransactions"

export function useTransactionSummary(range: DateRange | undefined) {
    const { data: transactions = [], isLoading } = useTransactions()

    return useMemo(() => {
        const filtered = transactions.filter((t) => {
            if (!t.event_time) return false
            const dt = new Date(t.event_time)
            if (!range?.from && !range?.to) return true
            let inRange = true
            if (range?.from) {
                inRange = inRange && dt >= startOfDay(range.from)
            }
            if (range?.to) {
                inRange = inRange && dt <= endOfDay(range.to)
            }
            return inRange
        })

        const categories: Record<string, { earned: number; spent: number }> = {}
        for (const t of filtered) {
            const cat = t.category || "Uncategorized"
            const amt = Number(t.amount) || 0
            if (!categories[cat]) categories[cat] = { earned: 0, spent: 0 }
            if (amt >= 0) {
                categories[cat].earned += amt
            } else {
                categories[cat].spent += Math.abs(amt)
            }
        }
        let totalEarned = 0,
            totalSpent = 0
        const entries = Object.entries(categories).map(([category, { earned, spent }]) => {
            totalEarned += earned
            totalSpent += spent
            return { category, earned, spent, net: earned - spent }
        })

        return {
            entries,
            totalEarned,
            totalSpent,
            netBalance: totalEarned - totalSpent,
            isLoading,
        }
    }, [transactions, range, isLoading])
}