import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Config – adjust these
const BASE_URL = process.env.APP_URL || 'http://localhost:4173';
const OUTPUT_DIR = path.resolve(__dirname, '../public');

// Test credentials (use environment variables for security)
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'password123';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function takeScreenshots() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Helper: wait for content to load
    async function waitForAppReady() {
        // Wait for the main heading (adjust if default route is different)
        await page.waitForSelector('h1', { timeout: 10000 });
        // Wait for any table or data to appear (optional)
        try {
            await page.waitForSelector('table', { timeout: 5000 });
        } catch {
            // If no table, that's fine – just take the shot
        }
        await page.waitForTimeout(500);
    }

    // Go to the app
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Handle login if redirected
    if (page.url().includes('/login')) {
        console.log('🔐 Logging in...');
        await page.fill('input[type="email"]', TEST_EMAIL);
        await page.fill('input[type="password"]', TEST_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle' });
        console.log('✅ Logged in');
    }

    // Wait for the app to be fully loaded
    await waitForAppReady();

    // 1. Desktop screenshot (wide)
    await page.setViewportSize({ width: 1920, height: 1080 });
    // Some pages need a small scroll to render lazy content
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshot-desktop.png'),
        fullPage: true,
    });
    console.log('✅ Desktop screenshot saved');

    // 2. Mobile screenshot (narrow)
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshot-mobile.png'),
        fullPage: true,
    });
    console.log('✅ Mobile screenshot saved');

    await browser.close();
}

takeScreenshots().catch((err) => {
    console.error('❌ Screenshot failed:', err);
    process.exit(1);
});