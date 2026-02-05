import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import QRCode from 'qrcode'

const args = process.argv.slice(2)
const urlIndex = args.findIndex((arg) => arg === '--url')
const url = urlIndex >= 0 ? args[urlIndex + 1] : null

if (!url) {
  console.error('Missing URL. Usage: npm run qr -- --url http://<ip>:5173/')
  process.exit(1)
}

const outDir = path.join(process.cwd(), 'public')
const outPath = path.join(outDir, 'qr.png')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

await QRCode.toFile(outPath, url, {
  width: 512,
  margin: 1,
  color: {
    dark: '#0f172a',
    light: '#ffffff',
  },
})

console.log(`QR code generated: ${outPath}`)
