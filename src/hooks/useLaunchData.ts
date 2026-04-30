import { useEffect, useState } from "react";

export type LaunchEvent = {
  id: number;
  target: number;
  launched: boolean;
  launched_at: string | null;
};

// Singleton socket connection
let socket: WebSocket | null = null;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "wss://recspolaunch-production.up.railway.app";

function getSocket() {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    // Determine connection URL correctly for local vs production
    const url = BACKEND_URL.startsWith('http') ? BACKEND_URL.replace(/^http/, 'ws') : BACKEND_URL;
    socket = new WebSocket(url);
  }
  return socket;
}

function getClientId() {
  const KEY = "launch_client_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function useLaunchData() {
  const [event, setEvent] = useState<LaunchEvent | null>(null);
  const [launchedCount, setLaunchedCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);

  useEffect(() => {
    const s = getSocket();
    
    const handleMessage = (msg: MessageEvent) => {
      try {
        const data = JSON.parse(msg.data);
        
        // Ignore targeted direct check_response messages in the global handler
        if (data.type === 'check_response') return;
        
        // Update global state based on the broadcasted launchState
        setEvent({
          id: 1,
          target: data.target || 2,
          launched: data.isLaunched || false,
          launched_at: data.launchTime || null
        });
        setLaunchedCount(data.clickCount || 0);
        setJoinedCount(data.participants ? data.participants.length : 0);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    s.addEventListener("message", handleMessage);

    return () => {
      s.removeEventListener("message", handleMessage);
    };
  }, []);

  return { event, launchedCount, joinedCount, refetch: () => {} };
}

export async function joinEvent() {
  const clientId = getClientId();
  // With the new reference backend, joining is implicit upon connection,
  // but we can ensure socket is created here.
  getSocket();
  return clientId;
}

export async function pressLaunch() {
  const clientId = getClientId();
  const s = getSocket();
  
  const payload = JSON.stringify({ type: 'launch_click', userId: clientId });
  
  if (s.readyState === WebSocket.OPEN) {
    s.send(payload);
  } else {
    s.addEventListener("open", () => {
      s.send(payload);
    }, { once: true });
  }
}

export async function checkHasLaunched(): Promise<boolean> {
  const clientId = getClientId();
  const s = getSocket();
  
  return new Promise((resolve) => {
    const handler = (msg: MessageEvent) => {
      try {
        const data = JSON.parse(msg.data);
        
        // If it's a direct response to our check
        if (data.type === 'check_response') {
          s.removeEventListener('message', handler);
          resolve(data.launched);
        } 
        // If it's a broadcast state, we can also derive the answer
        else if (data.participants !== undefined) {
          s.removeEventListener('message', handler);
          resolve(data.participants.includes(clientId));
        }
      } catch (error) {}
    };
    
    s.addEventListener('message', handler);
    
    const payload = JSON.stringify({ type: 'check_launched', userId: clientId });
    
    if (s.readyState === WebSocket.OPEN) {
      s.send(payload);
    } else {
      s.addEventListener("open", () => {
        s.send(payload);
      }, { once: true });
    }
  });
}

export function getMyClientId() {
  return getClientId();
}