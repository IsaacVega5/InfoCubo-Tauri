import { EventEmitter } from "@tauri-apps/plugin-shell";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

export const WebSocketContext = createContext<{
  sendMessage: (fcn: string, args? : { [key: string]: any }) => void;
  isConnected: boolean;
  subscribe: (fcn: string, callback: (args: any) => void) => void;
  unsubscribe: (fcn: string, callback: (args: any) => void) => void;
} | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
  url: string;
}

export function WebSocketProvider({ url, children }: WebSocketProviderProps) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventEmitter = useRef(new EventEmitter());

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    }

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    }

    socket.onmessage = (event) => {
      try{
        const message = JSON.parse(event.data);
        eventEmitter.current.emit(message.fcn || 'default', message.response);
      }catch(error){
        console.error("WebSocket message error:", error);
      }
    };

    ws.current = socket;

    return () => {
      socket.close();
      eventEmitter.current.removeAllListeners();
    }

  }, [url]);

  
  const sendMessage = useCallback((fcn: string, args?: { [key: string]: any}) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const message = { fcn, args };
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback((fcn: string, callback: (args: any) => void) => {
    eventEmitter.current.on(fcn, callback);
  }, [])

  const unsubscribe  = useCallback((fcn: string, callback: (args: any) => void) => {
    eventEmitter.current.off(fcn, callback);
  }, [])

  const value = {
    sendMessage, 
    isConnected,
    subscribe,
    unsubscribe ,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}