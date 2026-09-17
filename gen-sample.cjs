// Generates a sample Orbit export for today (and optionally past days).
// Usage: node gen-sample.js
// Output: orbit-sample.json in the current directory.

const fs = require("node:fs")
const path = require("node:path")
const { randomUUID } = require("node:crypto")

// --- Config --------------------------------------------------------------

const DAYS_BACK = 0          // 0 = today only. 6 = today + last 6 days.
const MIN_SESSIONS = 3       // per day
const MAX_SESSIONS = 6       // per day
const MIN_DURATION_MIN = 20  // shortest session, minutes
const MAX_DURATION_MIN = 120 // longest session, minutes
const INCLUDE_RUNNING = false // add a live session at the end of today

// Active hours window — sessions start between these local hours.
const START_HOUR = 8
const END_HOUR = 22

// --- Generator -----------------------------------------------------------

const MIN_MS = 60 * 1000

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function startOfDay(date) {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
}

function generateDay(dayOffset) {
    const day = new Date()
    day.setDate(day.getDate() - dayOffset)
    const dayStart = startOfDay(day)

    const count = randInt(MIN_SESSIONS, MAX_SESSIONS)
    const sessions = []

    // Pick `count` distinct start times within the active window, spaced out.
    const windowMs = (END_HOUR - START_HOUR) * 60 * MIN_MS
    const slotMs = Math.floor(windowMs / count)

    for (let i = 0; i < count; i++) {
        const slotStart = dayStart + (START_HOUR * 60 * MIN_MS) + i * slotMs
        // Random jitter within the slot, but leave room for the session.
        const jitter = randInt(0, Math.max(0, slotMs - MIN_DURATION_MIN * MIN_MS))
        const start = slotStart + jitter

        const durationMin = randInt(MIN_DURATION_MIN, MAX_DURATION_MIN)
        const end = start + durationMin * MIN_MS

        sessions.push({
            id: randomUUID(),
            start_time: start,
            end_time: end,
        })
    }

    return sessions.sort((a, b) => a.start_time - b.start_time)
}

const sessions = []
for (let i = DAYS_BACK; i >= 0; i--) {
    sessions.push(...generateDay(i))
}

if (INCLUDE_RUNNING) {
    sessions.push({
        id: randomUUID(),
        start_time: Date.now() - 12 * MIN_MS,
        end_time: null,
    })
}

const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions,
}

const outPath = path.resolve(__dirname, "orbit-sample.json")
fs.writeFileSync(outPath, JSON.stringify(data, null, 2))

// --- Summary -------------------------------------------------------------

const totalMs = sessions.reduce(
    (acc, s) => acc + ((s.end_time ?? Date.now()) - s.start_time),
    0
)
const totalH = Math.floor(totalMs / (60 * MIN_MS))
const totalM = Math.floor((totalMs % (60 * MIN_MS)) / MIN_MS)

console.log(`Wrote ${sessions.length} sessions → ${outPath}`)
console.log(`Total: ${totalH}h ${totalM}m across ${DAYS_BACK + 1} day(s)`)