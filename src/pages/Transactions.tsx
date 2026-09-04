import { useState } from 'react'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { DataPage } from '@/components/DataPage'
import { type Transaction } from '@/data/types'
import { initialTransactions } from '@/data/mockData'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const TIMEZONE = 'Asia/Kolkata'

function formatEventTime(utcDate: string): string {
    if (!utcDate) return 'N/A'
    return format(toZonedTime(new Date(utcDate), TIMEZONE), 'yyyy-MM-dd HH:mm')
}

export function Transactions() {
    const [transactions, setTransactions] = useState(initialTransactions)

    const columns = [
        { header: 'ID', accessor: 'id' as const },
        { header: 'Description', accessor: 'description' as const },
        { header: 'Amount (₹)', accessor: 'amount' as const },
        { header: 'Category', accessor: 'category' as const },
        { header: 'Location', accessor: 'location' as const },
        { header: 'Tags', accessor: 'tags' as const },
        {
            header: 'Event Time',
            accessor: (item: Transaction) => formatEventTime(item.event_time),
        },
    ]

    const handleAdd = (newItem: Omit<Transaction, 'id'>) => {
        const newId = String(Date.now())
        setTransactions([...transactions, { id: newId, ...newItem }])
    }

    return (
        <DataPage
            title="Transactions"
            data={transactions}
            columns={columns}
            onAdd={handleAdd}
            dateFilterKey="event_time"
            renderForm={(onSubmit, close) => (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        let eventTime = formData.get('event_time') as string
                        if (!eventTime) {
                            eventTime = new Date().toISOString()
                        }
                        onSubmit({
                            description: formData.get('description') as string,
                            amount: parseFloat(formData.get('amount') as string),
                            category: formData.get('category') as string,
                            location: formData.get('location') as string,
                            tags: formData.get('tags') as string,
                            event_time: eventTime,
                        })
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description *</Label>
                        <Input id="description" name="description" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="amount">Amount (₹) *</Label>
                        <Input id="amount" name="amount" type="number" step="0.01" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="category">Category *</Label>
                        <Input id="category" name="category" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input id="tags" name="tags" placeholder="e.g. food, lunch, quick" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="event_time">Event Time</Label>
                        <Input id="event_time" name="event_time" type="datetime-local" />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave blank to use current time.
                        </p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={close}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            )}
        />
    )
}