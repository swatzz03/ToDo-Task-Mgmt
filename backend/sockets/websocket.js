// backend/sockets/websocket.js
const WebSocket = require('ws');
const { getUserFromSession } = require('../utils/session');

const userSockets = new Map(); // Map<email, Set<socket>>

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (socket, req) => {
    const user = await getUserFromSession(req);
    if (!user) {
      socket.close();
      return;
    }

    // Add user socket to map
    if (!userSockets.has(user.email)) {
      userSockets.set(user.email, new Set());
    }
    userSockets.get(user.email).add(socket);

    socket.on('message', msg => {
      // Optional: Handle client-initiated messages
    });

    socket.on('close', () => {
      const set = userSockets.get(user.email);
      if (set) {
        set.delete(socket);
        if (set.size === 0) userSockets.delete(user.email);
      }
    });
  });
}

function broadcastToUser(email, payload) {
  const sockets = userSockets.get(email);
  if (sockets) {
    for (const socket of sockets) {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
      }
    }
  }
}

module.exports = { setupWebSocket, broadcastToUser };
