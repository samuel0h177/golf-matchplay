import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import QRCode from 'qrcode'

const args = process.argv.slice(2)
const portIndex = args.findIndex((arg) => arg === '--port')
const port = portIndex >= 0 ? args[portIndex + 1] : '5173'

const interfaces = os.networkInterfaces()
const ips = []

for (const name of Object.keys(interfaces)) {
  for (const net of interfaces[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      ips.push(net.address)
    }
  }
}

const ip = ips[0]

if (!ip) {
  console.error('No local IPv4 address found.')
  process.exit(1)
}

const url = `http://${ip}:${port}/`
const outPath = path.join(process.cwd(), 'public', 'qr.png')

await QRCode.toFile(outPath, url, {
  width: 512,
  margin: 1,
  color: {
    dark: '#0f172a',
    light: '#ffffff',
  },
})

console.log(`QR code generated: ${outPath}`)
console.log(`URL: ${url}`)
