// backend/server.js
const http = require('http');
const url = require('url');
const { connectToMongo } = require('./db/mongo');
const { handleTasksAPI } = require('./routes/taskRoutes');
const { handleGoogleAuth } = require('./auth/googleAuth');
const { setupWebSocket } = require('./sockets/websocket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Routing manually
  if (pathname.startsWith('/auth/google')) {
    return handleGoogleAuth(req, res);
  } else if (pathname.startsWith('/tasks')) {
    return handleTasksAPI(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Connect to MongoDB first
connectToMongo().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  // Attach WebSocket server
  setupWebSocket(server);
});
