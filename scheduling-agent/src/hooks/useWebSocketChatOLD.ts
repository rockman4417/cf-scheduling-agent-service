import { useState, useEffect, useRef, useCallback } from "react";

type WebSocketMessage = {
  chunk?: string;
  end?: boolean;
  error?: string;
};

export function useWebSocketChat(url: string) {
  const [response, setResponse] = useState<string>("");
  const [prevResponses, setPrevResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const tempResponseRef = useRef<string>("");

  useEffect(() => {
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    wsRef.current.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log("data", data);

      if (data.chunk) {
        tempResponseRef.current += data.chunk;
        setResponse((prev) => prev + data.chunk);
      } else if (data.end) {
        setLoading(false);
        const finalResponse = tempResponseRef.current;
        tempResponseRef.current = ""; // Reset after capturing
        setResponse("");
        setPrevResponses((prev) => [...prev, finalResponse]);
      } else if (data.error) {
        setError(data.error);
        setLoading(false);
      }
    };

    wsRef.current.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error.");
      setLoading(false);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [url]);

  useEffect(() => {
    console.log("Previous responses:", prevResponses);
  }, [prevResponses]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim() || !wsRef.current) return;
    setResponse("");
    setError(null);
    setLoading(true);
    wsRef.current.send(JSON.stringify({ prompt: message }));
  }, []);

  return { response, prevResponses, loading, error, sendMessage };
}
