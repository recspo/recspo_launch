import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export type LaunchEvent = {
  id: number;
  target: number;
  launched: boolean;
  launched_at: string | null;
};

// Singleton socket connection
let socket: Socket | null = null;
// Use localhost for local dev, or dynamic host based on window.location
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL);
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
    
    const handleStateUpdate = (data: any) => {
      setEvent(data.event);
      setLaunchedCount(data.launchedCount);
      setJoinedCount(data.joinedCount);
    };

    s.on("state_update", handleStateUpdate);

    // Fetch initial state if we don't have it yet, though server sends it on connect
    // We can also emit a "get_state" event if needed.

    return () => {
      s.off("state_update", handleStateUpdate);
    };
  }, []);

  return { event, launchedCount, joinedCount, refetch: () => {} };
}

export async function joinEvent() {
  const clientId = getClientId();
  const s = getSocket();
  s.emit("join", clientId);
  return clientId;
}

export async function pressLaunch() {
  const clientId = getClientId();
  const s = getSocket();
  s.emit("launch", clientId);
}

export async function checkHasLaunched(): Promise<boolean> {
  const clientId = getClientId();
  const s = getSocket();
  return new Promise((resolve) => {
    // If not connected yet, we could have a timeout or wait for connection
    if (s.connected) {
      s.emit("check_launched", clientId, (response: any) => {
        resolve(response.launched);
      });
    } else {
      s.once("connect", () => {
        s.emit("check_launched", clientId, (response: any) => {
          resolve(response.launched);
        });
      });
    }
  });
}

export function getMyClientId() {
  return getClientId();
}