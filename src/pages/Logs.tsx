import { useState } from 'react'
import { DataPage } from '@/components/DataPage'
import { type Log } from '@/data/types'
import { initialLogs } from '@/data/mockData'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { formatIST } from '@/lib/time'

export function Logs() {
    const [logs, setLogs] = useState(initialLogs)

    const columns = [
        { header: 'ID', accessor: 'id' as const },
        { header: 'Description', accessor: 'description' as const },
        { header: 'Category', accessor: 'category' as const },
        { header: 'Tags', accessor: 'tags' as const },
        { header: 'Place', accessor: 'place' as const },
        {
            header: 'Event Time',
            accessor: (item: Log) => formatIST(item.event_time),
        },
    ]

    const handleAdd = (newItem: Omit<Log, 'id'>) => {
        const newId = String(Date.now())
        setLogs([...logs, { id: newId, ...newItem }])
    }

    return (
        <DataPage
            title="Logs"
            data={logs}
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
                            category: formData.get('category') as string,
                            tags: formData.get('tags') as string,
                            place: formData.get('place') as string,
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
                        <Label htmlFor="category">Category *</Label>
                        <Input id="category" name="category" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input id="tags" name="tags" placeholder="e.g. system, auth" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="place">Place</Label>
                        <Input id="place" name="place" />
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