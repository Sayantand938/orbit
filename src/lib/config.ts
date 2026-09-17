/**
 * Central configuration for Orbit.
 *
 * Keep magic numbers and storage keys here so they live in one place.
 *
 * Note: `STORAGE_KEYS.THEME` is mirrored in the inline anti-FOUC script
 * in index.html (it can't import from TS). Update both if you ever
 * change the key.
 */

export const STORAGE_KEYS = {
    TIMER: "orbit-timer",
    UI: "orbit-ui",
    THEME: "theme",
} as const

export const TIMER = {
    /** Display refresh rate while the timer is running (ms). ~20 fps. */
    TICK_MS: 50,
    /** Default refresh rate for `useNowWhenRunning` (ms). */
    DEFAULT_TICK_MS: 1000,
} as const

export const HISTORY = {
    /** Hourly bar reaches full width at this duration; longer hours cap. */
    HOURLY_FULL_SCALE_MS: 30 * 60 * 1000,
    /** Zero-padding width for session serial numbers (01, 02, …). */
    SERIAL_PAD: 2,
} as const

export const DASHBOARD = {
    /** A day counts toward the "8+ hour days" stat at this threshold. */
    EIGHT_HOURS_MS: 8 * 60 * 60 * 1000,
} as const