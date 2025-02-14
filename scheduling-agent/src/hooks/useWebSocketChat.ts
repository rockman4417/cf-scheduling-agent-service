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
  const [extractedJson, setExtractedJson] = useState<any>(null); // Store extracted JSON
  const wsRef = useRef<WebSocket | null>(null);
  const tempResponseRef = useRef<string>("");
  const lastSentMessageRef = useRef<string>(""); // Store last sent message
  const resolvePromiseRef = useRef<((res: string) => void) | null>(null); // Promise resolve function
  const rejectPromiseRef = useRef<((err: string) => void) | null>(null); // Promise reject function

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

        // Resolve the promise with the final response
        if (resolvePromiseRef.current) {
          resolvePromiseRef.current(finalResponse);
          resolvePromiseRef.current = null;
          rejectPromiseRef.current = null;
        }
      } else if (data.error) {
        setError(data.error);
        setLoading(false);

        // Reject the promise if there's an error
        if (rejectPromiseRef.current) {
          rejectPromiseRef.current(data.error);
          resolvePromiseRef.current = null;
          rejectPromiseRef.current = null;
        }
      }
    };

    wsRef.current.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error.");
      setLoading(false);

      // Reject the promise if there's a WebSocket error
      if (rejectPromiseRef.current) {
        rejectPromiseRef.current("WebSocket connection error.");
        resolvePromiseRef.current = null;
        rejectPromiseRef.current = null;
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      wsRef.current?.close();
    };
  }, [url]);

  // Updated sendMessage function to return a Promise
  const sendMessage = useCallback((message: string): Promise<string> => {
    if (!message.trim() || !wsRef.current) {
      return Promise.reject("Invalid message or WebSocket not connected.");
    }

    setResponse("");
    setError(null);
    setLoading(true);
    setExtractedJson(null); // Reset extracted JSON before sending a new request
    lastSentMessageRef.current = message; // Store the sent message

    return new Promise((resolve, reject) => {
      resolvePromiseRef.current = resolve; // Store the resolver function
      rejectPromiseRef.current = reject; // Store the reject function
      wsRef.current!.send(JSON.stringify({ prompt: message }));
    });
  }, []);

  return { response, prevResponses, loading, error, extractedJson, sendMessage };
}
