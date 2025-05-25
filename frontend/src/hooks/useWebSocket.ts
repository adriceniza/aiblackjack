import { useEffect, useRef, useState } from "react";



export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
       if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        setIsConnected(true);
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Mensaje recibido:", data);
        setMessages((prev) => [...prev, data])
      } catch (error) {
        console.error("Error parseando mensaje WS", error);
      }
    };
    
    socketRef.current.onclose = () => {
      console.log("WebSocket cerrado");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  const sendMessage = (msg: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WS no está abierto");
    }
  };

  return { messages, sendMessage, isConnected, setMessages };
}
