// backend/server.js
const http = require('http');
const url = require('url');
const { connectToMongo } = require('./db/mongo');
const { handleTasksAPI } = require('./routes/taskRoutes');
const { handleGoogleAuth } = require('./auth/googleAuth');
const { setupWebSocket } = require('./sockets/websocket');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
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
