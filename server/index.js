// server/index.js
/*
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
*/
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const io = socketIo(server, {
  cors: { origin: CLIENT_URL, methods: ['GET', 'POST'] }
});

app.use(cors({ origin: CLIENT_URL }));
app.use(bodyParser.json());

let users = [];
try {
  users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
} catch (e) {
  console.error("Failed to load users.json:", e.message);
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  return user
    ? res.json({ success: true })
    : res.status(401).json({ success: false });
});

io.on('connection', socket => {
  socket.on('chat message', msg => socket.broadcast.emit('chat message', msg));
});

const clientPath = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(clientPath));

// ✅ FIXED: use "/*" instead of "*"
// ✅ Correct version that avoids path-to-regexp crash:
app.get("*", (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
