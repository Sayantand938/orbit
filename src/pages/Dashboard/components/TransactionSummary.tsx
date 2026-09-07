import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { RangePicker } from "@/components/ui/RangePicker"

interface TransactionSummaryProps {
    range: DateRange | undefined
    setRange: (range: DateRange | undefined) => void
    entries: { category: string; earned: number; spent: number; net: number }[]
    totalEarned: number
    totalSpent: number
    netBalance: number
    isLoading: boolean
}

export function TransactionSummary({
    range,
    setRange,
    entries,
    totalEarned,
    totalSpent,
    netBalance,
    isLoading,
}: TransactionSummaryProps) {
    if (isLoading) return <div className="p-4">Loading transactions...</div>

    return (
        <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <DollarSign className="size-5" />
                    Transactions – Summary
                </h2>
                <RangePicker range={range} setRange={setRange} />
            </div>

            {entries.length === 0 ? (
                <p className="text-muted-foreground">No transactions in this period.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-1">
                                    <TrendingUp className="size-4 text-green-600" />
                                    Total Earned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹{totalEarned.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-1">
                                    <TrendingDown className="size-4 text-red-600" />
                                    Total Spent
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">₹{totalSpent.toFixed(2)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Net Balance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={cn(
                                        "text-2xl font-bold",
                                        netBalance >= 0 ? "text-green-600" : "text-red-600"
                                    )}
                                >
                                    ₹{netBalance.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="border rounded-md overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Earned</TableHead>
                                    <TableHead className="text-right">Spent</TableHead>
                                    <TableHead className="text-right">Net</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map(({ category, earned, spent, net }) => (
                                    <TableRow key={category}>
                                        <TableCell>{category}</TableCell>
                                        <TableCell className="text-right text-green-600">₹{earned.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-red-600">₹{spent.toFixed(2)}</TableCell>
                                        <TableCell
                                            className={cn(
                                                "text-right font-medium",
                                                net >= 0 ? "text-green-600" : "text-red-600"
                                            )}
                                        >
                                            ₹{net.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}
        </section>
    )
}