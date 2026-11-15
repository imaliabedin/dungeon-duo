// Dungeon Duo online server: serves the game and relays messages between the host and the guest of each room.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
// The game page can sit next to this file (index.html) or inside a 'public' folder.
const PUBLIC = fs.existsSync(path.join(__dirname, 'public', 'index.html')) ? path.join(__dirname, 'public') : __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') url = '/index.html';
  const file = path.join(PUBLIC, path.normalize(url));
  if (!file.startsWith(PUBLIC) || !/\.(html|js|css|png|json)$/.test(file) || /(server\.js|package(-lock)?\.json)$/.test(file)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server, path: '/ws' });
const rooms = new Map(); // code -> { host, guest }
const send = (ws, m) => { if (ws && ws.readyState === 1) ws.send(typeof m === 'string' ? m : JSON.stringify(m)); };
const newCode = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; let c; do { c = Array.from({ length: 4 }, () => A[Math.floor(Math.random() * A.length)]).join(''); } while (rooms.has(c)); return c; };

wss.on('connection', ws => {
  ws.on('message', raw => {
    const text = raw.toString();
    let m; try { m = JSON.parse(text); } catch { return; }
    if (m.t === 'host') {
      const code = newCode(); rooms.set(code, { host: ws, guest: null });
      ws.room = code; ws.role = 'host'; return send(ws, { t: 'hosted', code });
    }
    if (m.t === 'join') {
      const code = String(m.code || '').toUpperCase(); const r = rooms.get(code);
      if (!r) return send(ws, { t: 'err', msg: 'Room not found' });
      if (r.guest) return send(ws, { t: 'err', msg: 'Room is full' });
      r.guest = ws; ws.room = code; ws.role = 'guest';
      send(ws, { t: 'joined' }); return send(r.host, { t: 'guest' });
    }
    const r = rooms.get(ws.room); if (!r) return;
    send(ws.role === 'host' ? r.guest : r.host, text); // relay game traffic
  });
  ws.on('close', () => {
    const r = rooms.get(ws.room); if (!r) return;
    const other = ws.role === 'host' ? r.guest : r.host;
    send(other, { t: 'left' });
    if (ws.role === 'host') rooms.delete(ws.room); else r.guest = null;
  });
});

server.listen(PORT, () => console.log(`Dungeon Duo server running at http://localhost:${PORT}`));
