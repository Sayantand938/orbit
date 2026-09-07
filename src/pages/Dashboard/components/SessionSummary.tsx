import { Clock } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RangePicker } from "@/components/ui/RangePicker"

function formatMinutes(minutes: number): string {
    if (minutes === 0) return "0m"
    const hrs = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
}

interface SessionSummaryProps {
    range: DateRange | undefined
    setRange: (range: DateRange | undefined) => void
    entries: { category: string; minutes: number }[]
    totalMinutes: number
    isLoading: boolean
}

export function SessionSummary({ range, setRange, entries, totalMinutes, isLoading }: SessionSummaryProps) {
    if (isLoading) return <div className="p-4">Loading sessions...</div>

    return (
        <section>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="size-5" />
                    Sessions – Time per Category
                </h2>
                <RangePicker range={range} setRange={setRange} />
            </div>

            {entries.length === 0 ? (
                <p className="text-muted-foreground">No sessions in this period.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Total Sessions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{entries.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Total Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatMinutes(totalMinutes)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Top Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold truncate">{entries[0]?.category || "—"}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="border rounded-md overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map(({ category, minutes }) => (
                                    <TableRow key={category}>
                                        <TableCell>{category}</TableCell>
                                        <TableCell className="text-right font-mono">{formatMinutes(minutes)}</TableCell>
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