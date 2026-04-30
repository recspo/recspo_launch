import { WebSocketServer } from 'ws';
import http from 'http';

// Create HTTP server for WebSocket
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocketServer({ 
  server,
  perMessageDeflate: false
});

// Start server on port from env or 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});

const TARGET = 2; // User requested 2 instead of 20

let launchState = {
  clickCount: 0,
  isLaunched: false,
  participants: [],
  launchTime: null,
  revealComplete: false,
  target: TARGET
};

// Enhanced logging
function logState(action) {
  console.log(`[${new Date().toISOString()}] ${action} - Count: ${launchState.clickCount}, Launched: ${launchState.isLaunched}, Participants: ${launchState.participants.length}`);
}

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
  console.log(`Broadcasting to ${wss.clients.size} clients`);
}

// Handle client connections
wss.on('connection', (ws) => {
  console.log(`New client connected. Total clients: ${wss.clients.size}`);
  
  // Send current state to new client
  ws.send(JSON.stringify(launchState));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'launch_click') {
        // Only accept clicks if not already launched and user hasn't clicked
        if (!launchState.isLaunched && !launchState.participants.includes(data.userId)) {
          launchState.participants.push(data.userId);
          launchState.clickCount = launchState.participants.length;
          
          // Check if we've reached the target clicks
          if (launchState.clickCount >= TARGET) {
            launchState.isLaunched = true;
            launchState.launchTime = new Date().toISOString();
          }
          
          logState(`Click from ${data.userId.substring(0, 8)}`);
          broadcast(launchState);
        }
      } else if (data.type === 'check_launched') {
        ws.send(JSON.stringify({ 
          type: 'check_response', 
          launched: launchState.participants.includes(data.userId) 
        }));
      } else if (data.type === 'reveal_now') {
        launchState.revealComplete = true;
        logState('Reveal completed');
        broadcast(launchState);
      } else if (data.type === 'reset') {
        // Reset the launch state
        launchState = {
          clickCount: 0,
          isLaunched: false,
          participants: [],
          launchTime: null,
          revealComplete: false,
          target: TARGET
        };
        logState('Launch reset');
        broadcast(launchState);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Client disconnected. Total clients: ${wss.clients.size}`);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Periodic status logging
setInterval(() => {
  if (wss.clients.size > 0) {
    console.log(`📈 Status: ${wss.clients.size} clients connected, ${launchState.clickCount}/${TARGET} participants`);
  }
}, 30000);
