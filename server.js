// Rocky's Mic - PC server
// Serves the phone page and receives mic audio over WebSocket, then plays it on the PC.
const http = require('http')
const fs = require('fs')
const path = require('path')
const os = require('os')
const { WebSocketServer } = require('ws')
const Speaker = require('speaker')

const PORT = 8080
const PAGE = path.join(__dirname, '..', 'phone', 'index.html')

function getLocalIP() {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const iface of list) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address
    }
  }
  return '127.0.0.1'
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(PAGE, (err, data) => {
      if (err) { res.writeHead(500); return res.end('phone/index.html missing') }
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(data)
    })
  } else {
    res.writeHead(404)
    res.end()
  }
})

const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('Phone connected')
  let speaker = null

  ws.on('message', (msg, isBinary) => {
    if (!isBinary) {
      // First message from the phone: audio settings
      const info = JSON.parse(msg.toString())
      if (info.type === 'hello') {
        speaker = new Speaker({ channels: 1, bitDepth: 16, sampleRate: info.sampleRate })
        speaker.on('error', (e) => console.error('Speaker error:', e.message))
        console.log(`Streaming at ${info.sampleRate} Hz`)
      }
      return
    }
    if (speaker && speaker.writable) speaker.write(msg)
  })

  ws.on('close', () => {
    console.log('Phone disconnected')
    if (speaker) speaker.end()
  })
})

server.listen(PORT, () => {
  console.log("\nRocky's Mic server running")
  console.log(`Open this on your phone: http://${getLocalIP()}:${PORT}\n`)
})
