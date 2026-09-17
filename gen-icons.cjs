const sharp = require("sharp")
const fs = require("node:fs")
const path = require("node:path")

const anySvg = fs.readFileSync(path.resolve(__dirname, "public/icon.svg"))
const maskableSvg = fs.readFileSync(path.resolve(__dirname, "public/icon-maskable.svg"))

async function run() {
    // Standard icons (purpose: any)
    for (const size of [192, 512]) {
        await sharp(anySvg).resize(size, size).png()
            .toFile(path.resolve(__dirname, `public/pwa-${size}x${size}.png`))
        console.log(`✓ pwa-${size}x${size}.png`)
    }

    // Maskable icon (purpose: maskable) — only need 512
    await sharp(maskableSvg).resize(512, 512).png()
        .toFile(path.resolve(__dirname, "public/pwa-maskable-512x512.png"))
    console.log("✓ pwa-maskable-512x512.png")

    // Apple touch icon
    await sharp(anySvg).resize(180, 180).png()
        .toFile(path.resolve(__dirname, "public/apple-touch-icon.png"))
    console.log("✓ apple-touch-icon.png")
}
run()