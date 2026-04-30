const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

const TARGET = 2;
let eventLaunched = false;
let eventLaunchedAt = null;

// Map of clientId -> { launched: boolean }
const participants = new Map();

function getState() {
  let launchedCount = 0;
  for (const p of participants.values()) {
    if (p.launched) launchedCount++;
  }
  
  if (launchedCount >= TARGET && !eventLaunched) {
    eventLaunched = true;
    eventLaunchedAt = new Date().toISOString();
  }

  return {
    event: {
      id: 1,
      target: TARGET,
      launched: eventLaunched,
      launched_at: eventLaunchedAt,
    },
    launchedCount,
    joinedCount: participants.size,
  };
}

io.on('connection', (socket) => {
  // Send current state on connection
  socket.emit('state_update', getState());

  socket.on('join', (clientId) => {
    if (!participants.has(clientId)) {
      participants.set(clientId, { launched: false });
      io.emit('state_update', getState());
    }
  });

  socket.on('launch', (clientId) => {
    const participant = participants.get(clientId);
    if (participant && !participant.launched) {
      participant.launched = true;
      io.emit('state_update', getState());
    }
  });

  socket.on('check_launched', (clientId, callback) => {
    const participant = participants.get(clientId);
    callback({ launched: participant ? participant.launched : false });
  });

  // Client disconnecting doesn't necessarily remove them from participants in this logic, 
  // since it's tied to clientId in local storage.
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
