import { useTheme } from '@/components/theme-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function Settings() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="p-6 space-y-6 max-w-2xl">
            <h1 className="text-2xl font-bold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Theme Preference</CardTitle>
                    <CardDescription>
                        Choose your preferred color scheme for the application.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={theme}
                        onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="light" id="light" />
                            <Label htmlFor="light" className="cursor-pointer">Light</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="dark" id="dark" />
                            <Label htmlFor="dark" className="cursor-pointer">Dark</Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="system" id="system" />
                            <Label htmlFor="system" className="cursor-pointer">System</Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
                You can also press <kbd className="px-1 py-0.5 rounded border bg-muted">d</kbd> to toggle between light and dark (when not on System).
            </p>
        </div>
    )
}