import { useState } from 'react'
import { DataPage } from '@/components/DataPage'
import { type Session } from '@/data/types'
import { initialSessions } from '@/data/mockData'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { formatIST } from '@/lib/time'

export function Sessions() {
    const [sessions, setSessions] = useState(initialSessions)

    const columns = [
        { header: 'ID', accessor: 'id' as const },
        { header: 'Description', accessor: 'description' as const },
        { header: 'Tags', accessor: 'tags' as const },
        {
            header: 'Start Time',
            accessor: (item: Session) => formatIST(item.startTime),
        },
        {
            header: 'End Time',
            accessor: (item: Session) => formatIST(item.endTime),
        },
    ]

    const handleAdd = (newItem: Omit<Session, 'id'>) => {
        const newId = String(Date.now())
        setSessions([...sessions, { id: newId, ...newItem }])
    }

    return (
        <DataPage
            title="Sessions"
            data={sessions}
            columns={columns}
            onAdd={handleAdd}
            renderForm={(onSubmit, close) => (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        let startTime = formData.get('startTime') as string
                        let endTime = formData.get('endTime') as string
                        if (!startTime) {
                            startTime = new Date().toISOString()
                        }
                        if (!endTime) {
                            const end = new Date(startTime)
                            end.setHours(end.getHours() + 1)
                            endTime = end.toISOString()
                        }
                        onSubmit({
                            description: formData.get('description') as string,
                            tags: formData.get('tags') as string,
                            startTime: startTime,
                            endTime: endTime,
                        })
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="description">Description *</Label>
                        <Input id="description" name="description" required />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input id="tags" name="tags" placeholder="e.g. coding, react" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input id="startTime" name="startTime" type="datetime-local" />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave blank to use current time.
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input id="endTime" name="endTime" type="datetime-local" />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave blank to set 1 hour after start.
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